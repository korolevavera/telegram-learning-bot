import asyncio
import logging
import time
from datetime import datetime, timedelta, timezone
from typing import Any

import aiohttp

from .config_loader import CONFIG

BO3_BASE = "https://api.bo3.gg/api/v1"
BO3_HEADERS = {
    "accept": "application/json, text/plain, */*",
    "origin": "https://bo3.gg",
    "referer": "https://bo3.gg/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0",
}

FACEIT_BASE = "https://open.faceit.com/data/v4"

CACHE_TTL = 15 * 60
PERIOD_DAYS = 180
TEAM_MATCHES_LIMIT = 15

TOP_TEAMS = 10
TOP_FACEIT = 20
TOP_PRO = 30

_session: aiohttp.ClientSession | None = None
_cache: dict[str, tuple[float, Any]] = {}
_avatar_semaphore = asyncio.Semaphore(5)

logger = logging.getLogger(__name__)


async def _get_session() -> aiohttp.ClientSession:
    global _session
    if _session is None or _session.closed:
        _session = aiohttp.ClientSession()
    return _session


def _read_cache(key: str, ttl: float) -> Any | None:
    item = _cache.get(key)
    if item and time.monotonic() - item[0] < ttl:
        return item[1]
    return None


def _write_cache(key: str, value: Any) -> Any:
    _cache[key] = (time.monotonic(), value)
    return value


async def _close_session() -> None:
    global _session
    if _session is not None and not _session.closed:
        await _session.close()


def _faceit_headers() -> dict[str, str] | None:
    if not CONFIG.faceit_api_key:
        return None
    return {"Authorization": f"Bearer {CONFIG.faceit_api_key}", "Accept": "application/json"}


async def _bo3_json(path: str, params: dict[str, Any]) -> list[dict]:
    session = await _get_session()
    async with session.get(
        f"{BO3_BASE}{path}", params=params, headers=BO3_HEADERS, timeout=20
    ) as response:
        response.raise_for_status()
        data = await response.json()
    return data.get("results", [])


async def _faceit_player_avatar(
    session: aiohttp.ClientSession, headers: dict[str, str], player_id: str
) -> str | None:
    if not player_id:
        return None
    async with _avatar_semaphore:
        try:
            async with session.get(
                f"{FACEIT_BASE}/players/{player_id}", headers=headers, timeout=15
            ) as response:
                if response.status != 200:
                    return None
                data = await response.json()
                return data.get("avatar")
        except Exception:
            return None


async def get_faceit_ranking(region: str = "EU", limit: int = TOP_FACEIT) -> list[dict]:
    key = f"faceit:{region}:{limit}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    headers = _faceit_headers()
    if headers is None:
        return []
    session = await _get_session()
    async with session.get(
        f"{FACEIT_BASE}/rankings/games/cs2/regions/{region}",
        params={"limit": limit},
        headers=headers,
        timeout=20,
    ) as response:
        response.raise_for_status()
        data = await response.json()
    items = data.get("items", [])
    avatars = await asyncio.gather(
        *[_faceit_player_avatar(session, headers, it.get("player_id")) for it in items],
        return_exceptions=True,
    )
    result = []
    for it, av in zip(items, avatars):
        if isinstance(av, Exception):
            av = None
        result.append(
            {
                "id": it.get("player_id"),
                "position": it.get("position"),
                "nickname": it.get("nickname"),
                "country": it.get("country"),
                "faceit_elo": it.get("faceit_elo"),
                "skill_level": it.get("game_skill_level"),
                "image": av,
            }
        )
    logger.info("fetched faceit ranking %s: %s", region, len(result))
    return _write_cache(key, result)


async def get_faceit_player_info(player_id: str) -> dict | None:
    key = f"faceit:player:{player_id}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    headers = _faceit_headers()
    if headers is None:
        return None
    session = await _get_session()

    async def _get(path: str) -> dict | None:
        async with session.get(
            f"{FACEIT_BASE}{path}", headers=headers, timeout=20
        ) as response:
            if response.status == 404:
                return None
            response.raise_for_status()
            return await response.json()

    p, st = await asyncio.gather(
        _get(f"/players/{player_id}"),
        _get(f"/players/{player_id}/stats/cs2"),
        return_exceptions=True,
    )
    if isinstance(p, Exception):
        p = None
    if isinstance(st, Exception):
        st = None
    if not isinstance(p, dict):
        return None

    g = (p.get("games") or {}).get("cs2") or {}
    life = {}
    segs = []
    if isinstance(st, dict):
        life = st.get("lifetime") or {}
        segs = st.get("segments") or []
    matches = _fnum(life.get("Matches"))
    wins = _fnum(life.get("Wins"))
    losses = round(matches - wins, 1) if matches is not None and wins is not None else None

    recent = []
    for r in (life.get("Recent Results") or [])[:12]:
        recent.append("W" if str(r) == "1" else "L")

    maps_list = []
    for seg in segs:
        if seg.get("type") != "Map":
            continue
        sm = seg.get("stats") or {}
        m_count = _fnum(sm.get("Matches"))
        if not m_count:
            continue
        maps_list.append(
            {
                "map": (seg.get("label") or "").replace("_", " "),
                "matches": m_count,
                "winrate": _fnum(sm.get("Win Rate %")),
                "kd": _fnum(sm.get("Average K/D Ratio")),
                "hs": _fnum(sm.get("Average Headshots %")),
            }
        )
    maps_list.sort(key=lambda m: -(m.get("matches") or 0))
    maps_list = maps_list[:6]

    info = {
        "player_id": p.get("player_id"),
        "nickname": p.get("nickname"),
        "country_code": p.get("country"),
        "verified": bool(p.get("verified")),
        "region": g.get("region"),
        "skill_level": g.get("skill_level"),
        "elo": g.get("faceit_elo"),
        "steam_id": p.get("steam_id_64"),
        "steam_nickname": p.get("steam_nickname"),
        "faceit_url": (p.get("faceit_url") or "").replace("{lang}", "en"),
        "activated_at": (p.get("activated_at") or "")[:10],
        "image": p.get("avatar"),
        "stats": {
            "matches": matches,
            "wins": wins,
            "losses": losses,
            "winrate": _pct(wins, matches) or _fnum(life.get("Win Rate %")),
            "kd": _fnum(life.get("Average K/D Ratio")),
            "hs": _fnum(life.get("Average Headshots %")),
            "adr": _fnum(life.get("ADR")),
            "kills": _fnum(life.get("Total Kills with extended stats")),
            "win_streak": _fnum(life.get("Current Win Streak")),
            "longest_streak": _fnum(life.get("Longest Win Streak")),
            "results": recent,
        },
        "maps": maps_list,
    }
    logger.info("fetched faceit player info: %s", player_id)
    return _write_cache(key, info)


async def _team_winrate(slug: str, days: int = PERIOD_DAYS) -> float | None:
    today = datetime.now(timezone.utc)
    start = (today - timedelta(days=days)).strftime("%Y-%m-%d")
    end = today.strftime("%Y-%m-%d")
    session = await _get_session()
    async with session.get(
        f"{BO3_BASE}/teams/{slug}/general_stats",
        params={"filter[start_date_from]": start, "filter[start_date_to]": end},
        headers=BO3_HEADERS,
        timeout=20,
    ) as response:
        response.raise_for_status()
        data = await response.json()
    games = data.get("games_count") or 0
    won = data.get("games_won_count") or 0
    if games <= 0:
        return None
    return round(won / games * 100, 1)


async def get_bo3_teams(limit: int = TOP_TEAMS, days: int = PERIOD_DAYS) -> list[dict]:
    key = f"bo3:teams:{limit}:{days}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    raw = await _bo3_json(
        "/filters/teams",
        {
            "page[offset]": 0,
            "page[limit]": limit,
            "filter[teams.discipline_id][eq]": 1,
            "sort": "rank",
            "with": "country",
        },
    )
    winrates = await asyncio.gather(
        *[_team_winrate(t["slug"], days) for t in raw], return_exceptions=True
    )
    result = []
    for t, wr in zip(raw, winrates):
        if isinstance(wr, Exception):
            wr = None
        result.append(
            {
                "rank": t.get("rank"),
                "name": t.get("name"),
                "slug": t.get("slug"),
                "country_code": (t.get("country") or {}).get("code"),
                "value": wr,
                "decimals": 1,
                "image": t.get("image_url"),
            }
        )
    logger.info("fetched bo3 teams: %s", len(result))
    return _write_cache(key, result)


async def get_bo3_players(limit: int = TOP_PRO, days: int = PERIOD_DAYS) -> list[dict]:
    key = f"bo3:players:{limit}:{days}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    raw = await _bo3_json(
        "/players",
        {
            "page[offset]": 0,
            "page[limit]": limit,
            "sort": "rank",
            "with": "team,country",
        },
    )
    result = []
    for p in raw:
        rating = p.get("six_month_avg_rating")
        result.append(
            {
                "rank": p.get("rank"),
                "name": p.get("nickname"),
                "slug": p.get("slug"),
                "team": (p.get("team") or {}).get("name"),
                "country_code": (p.get("country") or {}).get("code"),
                "value": rating,
                "decimals": 2,
                "image": (p.get("image_versions") or {}).get("webp") or p.get("image_url"),
            }
        )
    logger.info("fetched bo3 players: %s", len(result))
    return _write_cache(key, result)


def _pct(won: Any, total: Any) -> float | None:
    if not total:
        return None
    return round(float(won) / float(total) * 100, 1)


_RU_COUNTRIES = {
    "RU": "России", "UA": "Украины", "KZ": "Казахстана", "BY": "Беларуси",
    "PL": "Польши", "DE": "Германии", "SE": "Швеции", "DK": "Дании",
    "NO": "Норвегии", "FI": "Финляндии", "LV": "Латвии", "EE": "Эстонии",
    "LT": "Литвы", "RS": "Сербии", "TR": "Турции", "HU": "Венгрии",
    "CZ": "Чехии", "SK": "Словакии", "BG": "Болгарии", "RO": "Румынии",
    "GR": "Греции", "IT": "Италии", "NL": "Нидерландов", "BE": "Бельгии",
    "PT": "Португалии", "ES": "Испании", "FR": "Франции", "GB": "Великобритании",
    "US": "США", "CA": "Канады", "BR": "Бразилии", "AU": "Австралии",
    "AR": "Аргентины", "CL": "Чили", "PE": "Перу", "MX": "Мексики",
    "CO": "Колумбии", "ID": "Индонезии", "PH": "Филиппин", "TH": "Таиланда",
    "VN": "Вьетнама", "SG": "Сингапура", "IN": "Индии", "IL": "Израиля",
    "SA": "Саудовской Аравии", "AE": "ОАЭ", "CN": "Китая", "KR": "Южной Кореи",
    "JP": "Японии", "HR": "Хорватии", "BA": "Боснии и Герцеговины",
    "ME": "Черногории", "MK": "Северной Македонии", "XK": "Косова",
    "GE": "Грузии", "AM": "Армении", "AZ": "Азербайджана", "UZ": "Узбекистана",
    "MD": "Молдовы", "AT": "Австрии", "CH": "Швейцарии", "IE": "Ирландии",
}

_RU_MONTHS = {
    1: "января", 2: "февраля", 3: "марта", 4: "апреля", 5: "мая", 6: "июня",
    7: "июля", 8: "августа", 9: "сентября", 10: "октября", 11: "ноября", 12: "декабря",
}

_TIER_RU = {"s": "S", "a": "A", "b": "B", "c": "C", "d": "D"}


def _plural(n: int, one: str, few: str, many: str) -> str:
    n10, n100 = n % 10, n % 100
    if n10 == 1 and n100 != 11:
        return one
    if 2 <= n10 <= 4 and not (12 <= n100 <= 14):
        return few
    return many


def _fmt_date(value: Any) -> str | None:
    text = str(value or "")[:10]
    if len(text) != 10:
        return None
    try:
        d = datetime.strptime(text, "%Y-%m-%d")
    except ValueError:
        return None
    return f"{d.day} {_RU_MONTHS[d.month]} {d.year} года"


def _fmt_money(value: Any) -> str:
    try:
        return f"{int(float(value)):,}".replace(",", " ")
    except (TypeError, ValueError):
        return ""


def _build_player_bio(p: dict) -> str:
    nickname = p.get("nickname") or "игрок"
    real = " ".join(filter(None, (p.get("first_name"), p.get("last_name"))))
    country = _RU_COUNTRIES.get(p.get("country_code")) or p.get("country_name")
    role = p.get("role")
    team = p.get("team")

    opening = nickname
    if real:
        opening += f" (настоящее имя — {real})"
    opening += " — профессиональный игрок в Counter-Strike 2"
    details = []
    if country:
        details.append(f"родом из {country}")
    bd = _fmt_date(p.get("birthday"))
    if bd:
        text = f"родился {bd}"
        if p.get("age") is not None:
            text += f" ({p['age']} {_plural(p['age'], 'год', 'года', 'лет')})"
        details.append(text)
    if role:
        details.append(f"играет на позиции {role}")
    if team:
        details.append(f"сейчас выступает за команду {team}")
    if details:
        opening += " — " + ", ".join(details) + "."
    parts = [opening]

    timeline = p.get("teams") or []
    if timeline:
        dedup = []
        for t in timeline:
            if dedup and dedup[-1].get("team") == t.get("team"):
                dedup[-1] = t
            else:
                dedup.append(t)
        timeline = dedup
        steps = []
        first = timeline[0]
        if first.get("date"):
            start = f"Профессиональную карьеру начал в {str(first['date'])[:4]} году"
        else:
            start = "Профессиональную карьеру начинал с первых командных составов"
        if first.get("team"):
            start += f" в {first['team']}"
        steps.append(start + ".")
        final_team = timeline[-1].get("team") if len(timeline) > 1 else None
        for t in timeline[1:-1]:
            if not t.get("team"):
                continue
            if final_team and t.get("team") == final_team:
                continue
            if t.get("date"):
                steps.append(f"В {str(t['date'])[:4]} году перешёл в {t['team']}.")
            else:
                steps.append(f"Затем выступал за {t['team']}.")
        if len(timeline) > 1 and final_team:
            joined = _fmt_date(p.get("joined_team_at"))
            if joined:
                steps.append(f"С {joined} выступает за {final_team}.")
            else:
                steps.append(f"В итоге оказался в {final_team}.")
        parts.append(" ".join(steps))

    won = [a for a in (p.get("achievements") or []) if (a.get("title") or "").lower() == "winner"]
    if won:
        names = ", ".join(
            a["tournament"] for a in won if a.get("tournament")
        )
        if not names:
            names = None
        count = len(won)
        text = (
            f"История успеха {nickname} насчитывает {count} "
            f"побед{_plural(count, 'у', 'ы', '')} на профессиональных турнирах"
        )
        if names:
            text += f" — среди них {names}"
        text += "."
        parts.append(text)

    prize = _fmt_money(p.get("total_prize"))
    if prize:
        parts.append(f"За карьеру суммарные призовые превысили ${prize}.")

    stats = p.get("stats") or {}
    rating = p.get("rating")
    if rating is not None:
        extras = []
        if stats.get("match_winrate") is not None:
            extras.append(f"винрейт в матчах — {stats['match_winrate']:.1f}%")
        if stats.get("kd") is not None:
            extras.append(f"K/D — {stats['kd']:.2f}")
        if stats.get("adr") is not None:
            extras.append(f"средний урон за раунд — {stats['adr']:.1f}")
        if stats.get("hs") is not None:
            extras.append(f"точность попаданий в голову — {stats['hs']:.1f}%")
        period_txt = p.get("period_label") or "за последние шесть месяцев"
        tail = f"{period_txt.capitalize()} рейтинг {nickname} составил {rating:.2f}"
        if extras:
            tail += " (" + ", ".join(extras) + ")"
        tail += " — это подтверждает его статус одного из самых ярких игроков современной сцены."
        parts.append(tail)

    return "\n\n".join(p for p in parts if p)


def _fnum(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


async def _team_matches(
    session: aiohttp.ClientSession, team_id: int, limit: int = TEAM_MATCHES_LIMIT
) -> list[dict]:
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    start = (now - timedelta(days=PERIOD_DAYS)).strftime("%Y-%m-%d")
    async with session.get(
        f"{BO3_BASE}/matches",
        params={
            "page[offset]": 0,
            "page[limit]": limit,
            "sort": "-start_date",
            "filter[matches.status][in]": "finished",
            "filter[matches.team_ids][overlap]": team_id,
            "filter[matches.start_date][gt]": start,
            "filter[matches.start_date][lt]": today,
            "filter[matches.discipline_id][eq]": 1,
            "with": "teams,tournament,games",
        },
        headers=BO3_HEADERS,
        timeout=20,
    ) as response:
        response.raise_for_status()
        data = await response.json()
    raw = data.get("results", data if isinstance(data, list) else [])
    result = []
    for m in raw:
        t1 = m.get("team1") or {}
        t2 = m.get("team2") or {}
        t1_id = t1.get("id") or m.get("team1_id")
        t2_id = t2.get("id") or m.get("team2_id")
        if t1_id == team_id:
            opp = t2
            our, opp_scores = t1, (m.get("team1_score"), m.get("team2_score"))
        elif t2_id == team_id:
            opp = t1
            our, opp_scores = t2, (m.get("team2_score"), m.get("team1_score"))
        else:
            continue
        games = m.get("games") or []
        our_score, opp_score = opp_scores
        if our_score is None or opp_score is None:
            if games:
                our_score = sum(
                    1
                    for g in games
                    if (g.get("winner_team_clan") or {}).get("team", {}).get("id") == team_id
                )
                opp_score = len(games) - our_score
            else:
                our_score = opp_score = 0
        if our_score > opp_score:
            res = "win"
        elif our_score < opp_score:
            res = "loss"
        else:
            res = "draw"
        maps = []
        for g in games:
            winner_id = (g.get("winner_team_clan") or {}).get("team", {}).get("id")
            if winner_id == team_id:
                maps.append(
                    {
                        "map": g.get("map_name"),
                        "our": g.get("winner_clan_score"),
                        "opp": g.get("loser_clan_score"),
                        "result": "win",
                    }
                )
            else:
                maps.append(
                    {
                        "map": g.get("map_name"),
                        "our": g.get("loser_clan_score"),
                        "opp": g.get("winner_clan_score"),
                        "result": "loss",
                    }
                )
        tournament = m.get("tournament") or {}
        result.append(
            {
                "date": (m.get("start_date") or "")[:10],
                "result": res,
                "our_score": our_score,
                "opp_score": opp_score,
                "opponent": opp.get("name"),
                "opponent_slug": opp.get("slug"),
                "opponent_image": opp.get("image_url"),
                "event": tournament.get("name"),
                "tier": tournament.get("tier") or m.get("tier"),
                "maps": maps,
            }
        )
    return result


async def get_team_info(slug: str) -> dict | None:
    key = f"bo3:team:{slug}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    session = await _get_session()
    async with session.get(
        f"{BO3_BASE}/teams/{slug}", params={"prefer_locale": "en"}, headers=BO3_HEADERS, timeout=20
    ) as response:
        if response.status == 404:
            return None
        response.raise_for_status()
        data = await response.json()
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    start = (now - timedelta(days=PERIOD_DAYS)).strftime("%Y-%m-%d")
    team_id = data.get("id")

    async def _general() -> dict:
        async with session.get(
            f"{BO3_BASE}/teams/{slug}/general_stats",
            params={"filter[start_date_from]": start, "filter[start_date_to]": today},
            headers=BO3_HEADERS,
            timeout=20,
        ) as response:
            response.raise_for_status()
            return await response.json()

    async def _advanced() -> dict:
        async with session.get(
            f"{BO3_BASE}/teams/{slug}/advanced_stats",
            params={"filter[begin_at_from]": start, "filter[begin_at_to]": today},
            headers=BO3_HEADERS,
            timeout=20,
        ) as response:
            response.raise_for_status()
            d = await response.json()
            if isinstance(d, list):
                return d[0] if d else {}
            return d

    g, adv, matches = await asyncio.gather(
        _general(),
        _advanced(),
        _team_matches(session, team_id) if team_id else asyncio.sleep(0, result=[]),
        return_exceptions=True,
    )
    if isinstance(g, Exception):
        g = {}
    if isinstance(adv, Exception):
        adv = {}
    if isinstance(matches, Exception):
        matches = []

    games = g.get("games_count") or 0
    wins = g.get("games_won_count") or 0
    losses = g.get("games_lost_count") or 0
    matches_n = g.get("matches_count") or 0
    matches_won = g.get("matches_won_count") or 0
    matches_lost = g.get("matches_lost_count") or 0
    kills = g.get("kills_sum") or 0
    deaths = g.get("deaths_sum") or 0
    rounds = g.get("rounds_count") or 0
    rounds_won = g.get("rounds_won_count") or 0

    country = data.get("country") or {}
    roster = []
    for p in data.get("players") or []:
        roster.append(
            {
                "nickname": p.get("nickname"),
                "country_code": (p.get("country") or {}).get("code"),
                "image": (p.get("image_versions") or {}).get("webp") or p.get("image_url"),
                "is_coach": bool(p.get("is_coach")),
                "role": p.get("role"),
            }
        )
    achievements = []
    for a in (data.get("achievements") or [])[:12]:
        tr = a.get("tournament") or {}
        achievements.append(
            {
                "date": a.get("date"),
                "title": a.get("title"),
                "tournament": tr.get("name"),
                "tier": tr.get("tier"),
                "prize": tr.get("prize"),
            }
        )
    info = {
        "slug": data.get("slug"),
        "name": data.get("name"),
        "acronym": data.get("acronym"),
        "rank": data.get("rank"),
        "rank_diff": data.get("rank_diff"),
        "country_code": country.get("code"),
        "country_name": country.get("name"),
        "est_date": data.get("est_date"),
        "six_month_earned": data.get("six_month_earned"),
        "image": data.get("image_url"),
        "stats": {
            "games": games,
            "wins": wins,
            "losses": losses,
            "winrate": _pct(wins, games),
            "matches": matches_n,
            "matches_won": matches_won,
            "matches_lost": matches_lost,
            "match_winrate": _pct(matches_won, matches_n),
            "kills": kills,
            "deaths": deaths,
            "kd": round(kills / deaths, 2) if deaths else None,
            "round_wr": _pct(rounds_won, rounds),
            "t_wr": _pct(adv.get("t_round_wins_count"), adv.get("t_rounds_count")),
            "ct_wr": _pct(adv.get("ct_round_wins_count"), adv.get("ct_rounds_count")),
            "pistol_wr": _pct(adv.get("pistol_round_wins_count"), adv.get("pistol_rounds_count")),
            "eco_wr": _pct(adv.get("eco_round_wins_count"), adv.get("eco_rounds_count")),
            "force_wr": _pct(adv.get("force_round_wins_count"), adv.get("force_rounds_count")),
            "buy_wr": _pct(adv.get("full_buy_round_wins_count"), adv.get("full_buy_rounds_count")),
        },
        "matches": matches,
        "roster": roster,
        "achievements": achievements,
    }
    logger.info("fetched team info: %s", slug)
    return _write_cache(key, info)


async def get_player_info(slug: str, period_days: int = PERIOD_DAYS) -> dict | None:
    key = f"bo3:player:{slug}:{period_days}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    session = await _get_session()
    async with session.get(
        f"{BO3_BASE}/players/{slug}", params={"prefer_locale": "en"}, headers=BO3_HEADERS, timeout=20
    ) as response:
        if response.status == 404:
            return None
        response.raise_for_status()
        data = await response.json()
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    start = (now - timedelta(days=period_days)).strftime("%Y-%m-%d")
    player_id = data.get("id")

    async def _general() -> dict:
        async with session.get(
            f"{BO3_BASE}/players/{slug}/general_stats",
            params={"filter[start_date_from]": start, "filter[start_date_to]": today},
            headers=BO3_HEADERS,
            timeout=20,
        ) as response:
            response.raise_for_status()
            return await response.json()

    async def _maps() -> list[dict]:
        async with session.get(
            f"{BO3_BASE}/players/{slug}/map_stats",
            params={"filter[begin_at_from]": start, "filter[begin_at_to]": today},
            headers=BO3_HEADERS,
            timeout=20,
        ) as response:
            response.raise_for_status()
            d = await response.json()
            return d if isinstance(d, list) else []

    async def _accuracy() -> list[dict]:
        async with session.get(
            f"{BO3_BASE}/players/{slug}/accuracy_stats",
            params={"filter[begin_at_from]": start, "filter[begin_at_to]": today},
            headers=BO3_HEADERS,
            timeout=20,
        ) as response:
            response.raise_for_status()
            d = await response.json()
            return d if isinstance(d, list) else []

    async def _transfers() -> list[dict]:
        async with session.get(
            f"{BO3_BASE}/player_transfers",
            params={
                "filter[player_id][eq]": player_id,
                "filter[is_coach][eq]": "false",
                "sort": "-action_date",
                "with": "teams,player",
                "page[limit]": 40,
            },
            headers=BO3_HEADERS,
            timeout=20,
        ) as response:
            response.raise_for_status()
            d = await response.json()
            return d.get("results", [])

    g, maps, acc, transfers = await asyncio.gather(
        _general(), _maps(), _accuracy(), _transfers(), return_exceptions=True
    )
    if not isinstance(g, dict):
        g = {}
    if not isinstance(maps, list):
        maps = []
    if not isinstance(acc, list):
        acc = []
    if not isinstance(transfers, list):
        transfers = []

    games = g.get("games_count") or 0
    wins = g.get("games_won_count") or 0
    losses = g.get("games_lost_count") or 0
    matches_n = g.get("matches_count") or 0
    matches_won = g.get("matches_won_count") or 0
    matches_lost = g.get("matches_lost_count") or 0
    kills = g.get("kills_sum") or 0
    deaths = g.get("deaths_sum") or 0
    assists = g.get("assists_sum") or 0
    rounds = g.get("rounds_count") or 0
    rounds_won = g.get("rounds_won_count") or 0

    total_hits = sum((r.get("hits_sum") or 0) for r in acc)
    head_hits = sum(
        (r.get("hits_sum") or 0) for r in acc if (r.get("hit_group") or "").lower() == "head"
    )
    hs = round(head_hits / total_hits * 100, 1) if total_hits else None
    adr = round((g.get("damage_sum") or 0) / rounds, 1) if rounds else None

    country = data.get("country") or {}
    team = data.get("team") or {}
    birthday = data.get("birthday")
    age = None
    if birthday:
        try:
            bday = datetime.strptime(str(birthday)[:10], "%Y-%m-%d")
            age = now.year - bday.year - ((now.month, now.day) < (bday.month, bday.day))
        except ValueError:
            age = None

    maps_list = []
    for row in sorted(maps, key=lambda r: -(r.get("maps_count") or 0)):
        if not (row.get("maps_count") or 0):
            continue
        maps_list.append(
            {
                "map": row.get("map_name"),
                "maps_count": row.get("maps_count"),
                "avg_rating": round(row.get("avg_player_rating") or 0, 2),
                "avg_kills": round(row.get("avg_kills") or 0, 2),
                "avg_damage": round(row.get("avg_damage") or 0, 1),
            }
        )

    timeline = []
    for tr in reversed(transfers):
        to = tr.get("team_to") or {}
        if not to.get("name"):
            continue
        timeline.append(
            {
                "team": to.get("name"),
                "slug": to.get("slug"),
                "image": to.get("image_url"),
                "date": (tr.get("action_date") or "")[:10],
            }
        )

    achievements = []
    for a in (data.get("achievements") or [])[:12]:
        tr = a.get("tournament") or {}
        achievements.append(
            {
                "date": a.get("date"),
                "title": a.get("title"),
                "tournament": tr.get("name"),
                "tier": tr.get("tier"),
                "prize": tr.get("prize"),
            }
        )

    info = {
        "slug": data.get("slug"),
        "nickname": data.get("nickname"),
        "first_name": data.get("first_name"),
        "last_name": data.get("last_name"),
        "birthday": birthday,
        "age": age,
        "country_code": country.get("code"),
        "country_name": country.get("name"),
        "team": team.get("name"),
        "team_slug": team.get("slug"),
        "joined_team_at": data.get("joined_team_at"),
        "total_prize": data.get("total_prize"),
        "rating": round(data.get("six_month_avg_rating") or 0, 2),
        "role": data.get("role"),
        "aliases": [a.get("name") for a in (data.get("alternative_names") or []) if a.get("name")],
        "tags": [t.get("name") for t in (data.get("tags") or []) if t.get("name")],
        "region": (country.get("region") or {}).get("name"),
        "twitter": data.get("twitter"),
        "twitch": data.get("twitch"),
        "facebook": data.get("facebook"),
        "team_image": team.get("image_url"),
        "image": (data.get("image_versions") or {}).get("webp") or data.get("image_url"),
        "stats": {
            "matches": matches_n,
            "matches_won": matches_won,
            "matches_lost": matches_lost,
            "match_winrate": _pct(matches_won, matches_n),
            "games": games,
            "wins": wins,
            "losses": losses,
            "winrate": _pct(wins, games),
            "kills": kills,
            "deaths": deaths,
            "assists": assists,
            "kd": round(kills / deaths, 2) if deaths else None,
            "hs": hs,
            "adr": adr,
            "round_wr": _pct(rounds_won, rounds),
        },
        "maps": maps_list,
        "teams": timeline,
        "achievements": achievements,
    }
    info["period_days"] = period_days
    info["period_label"] = "за последние " + _months_full(period_days)
    info["bio_text"] = _build_player_bio(info)
    logger.info("fetched player info: %s", slug)
    return _write_cache(key, info)


def _months_label(days: int) -> str:
    if days <= 90:
        return "3 мес."
    if days <= 180:
        return "6 мес."
    return "12 мес."


def _months_full(days: int) -> str:
    if days <= 90:
        return "три месяца"
    if days <= 180:
        return "шесть месяцев"
    return "двенадцать месяцев"


async def get_stats(region: str = "EU", period_days: int = PERIOD_DAYS) -> dict:
    key = f"stats:{region}:{period_days}"
    cached = _read_cache(key, CACHE_TTL)
    if cached is not None:
        return cached
    faceit, teams, pro = await asyncio.gather(
        get_faceit_ranking(region, TOP_FACEIT),
        get_bo3_teams(TOP_TEAMS, period_days),
        get_bo3_players(TOP_PRO, period_days),
        return_exceptions=True,
    )
    months = _months_label(period_days)
    sections = []
    if isinstance(teams, list):
        sections.append(
            {
                "id": "teams",
                "title": "Команды",
                "subtitle": f"Топ-{len(teams)} · винрейт за {months}",
                "unit": "WIN%",
                "items": teams,
            }
        )
    if isinstance(faceit, list):
        items = [
            {
                "rank": it.get("position"),
                "name": it.get("nickname"),
                "id": it.get("id"),
                "level": it.get("skill_level"),
                "country_code": it.get("country"),
                "value": it.get("faceit_elo"),
                "decimals": 0,
                "image": it.get("image"),
            }
            for it in faceit
        ]
        sections.append(
            {
                "id": "faceit",
                "title": "FACEIT",
                "subtitle": f"Топ-{len(items)} · регион {region}",
                "unit": "ELO",
                "items": items,
            }
        )
    if isinstance(pro, list):
        sections.append(
            {
                "id": "pro",
                "title": "Про-сцена",
                "subtitle": f"Топ-{len(pro)} · рейтинг за {months}",
                "unit": "RATING",
                "items": pro,
            }
        )
    result = {
        "source": "faceit+bo3",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "period_days": period_days,
        "region": region,
        "sections": sections,
    }
    return _write_cache(key, result)


async def close() -> None:
    await _close_session()


def clear_cache() -> None:
    _cache.clear()
