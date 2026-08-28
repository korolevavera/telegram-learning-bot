"""Mini-games content for CS2 Coach.

Games:
1. callouts — Name the callout shown on map (text input / MCQ)
2. utility  — Identify the utility type from description
3. economy — Quick economy decisions (buy/save/force)
"""

# ── Map Callouts Quiz ──────────────────────────────────────────────
# Each question: { map, point (image/coords hint), callout, options }
CALLOUT_QUESTIONS = [
    {"map": "mirage", "point": "Middle", "callout": "Top Mid", "options": ["Top Mid", "Mid Boxes", "Window", "Connector"]},
    {"map": "mirage", "point": "B Site", "callout": "Bench", "options": ["Bench", "Van", "Get Right", "Market Door"]},
    {"map": "mirage", "point": "A Site", "callout": "Triple", "options": ["Triple", "Default", "Firebox", "Palace"]},
    {"map": "mirage", "point": "A Ramp", "callout": "Tetris", "options": ["Tetris", "Stairs", "Jungle", "Sandwich"]},
    {"map": "mirage", "point": "Connector", "callout": "Connector", "options": ["Connector", "Window", "Short", "Catwalk"]},
    {"map": "mirage", "point": "B Apps", "callout": "Apps", "options": ["Apps", "Underpass", "TV Room", "Market"]},
    {"map": "dust2", "point": "Long Doors", "callout": "Long Doors", "options": ["Long Doors", "Pit", "Goose", "Cross"]},
    {"map": "dust2", "point": "B Site", "callout": "Car", "options": ["Car", "Door", "Window", "Big Box"]},
    {"map": "dust2", "point": "Mid", "callout": "Lower Tunnels", "options": ["Lower Tunnels", "Upper Tunnels", "Xbox", "Short Stairs"]},
    {"map": "dust2", "point": "A Site", "callout": "Goose", "options": ["Goose", "Ramp", "Barrels", "Default"]},
    {"map": "dust2", "point": "CT Spawn", "callout": "CT Spawn", "options": ["CT Spawn", "B Doors", "Mid Doors", "Suicide"]},
    {"map": "dust2", "point": "Long A", "callout": "Pit", "options": ["Pit", "Blue", "Long Corner", "Platform"]},
    {"map": "inferno", "point": "Banana", "callout": "Car", "options": ["Car", "Logs", "Sandbags", "Top Banana"]},
    {"map": "inferno", "point": "A Site", "callout": "Pit", "options": ["Pit", "Moto", "Graveyard", "Apartments"]},
    {"map": "inferno", "point": "B Site", "callout": "New Box", "options": ["New Box", "Dark", "First Oranges", "Second Oranges"]},
    {"map": "inferno", "point": "Mid", "callout": "Mid", "options": ["Mid", "Second Mid", "Alt Mid", "Bedroom"]},
    {"map": "inferno", "point": "Apartments", "callout": "Balcony", "options": ["Balcony", "Patio", "Boiler", "Long Hall"]},
    {"map": "inferno", "point": "B Ramp", "callout": "Logs", "options": ["Logs", "Tree", "Construction", "Coffins"]},
    {"map": "nuke", "point": "A Site", "callout": "Heaven", "options": ["Heaven", "Rafters", "A Main", "Squeaky"]},
    {"map": "nuke", "point": "B Site", "callout": "Ramp", "options": ["Ramp", "Turnpike", "B Main", "Decon"]},
    {"map": "ancient", "point": "A Site", "callout": "Donut", "options": ["Donut", "Main", "Temple", "Big Box"]},
    {"map": "ancient", "point": "Mid", "callout": "Red Room", "options": ["Red Room", "Cheetah", "Cave", "Elbow"]},
    {"map": "overpass", "point": "B Site", "callout": "Monster", "options": ["Monster", "Short", "Pit", "Barrels"]},
    {"map": "overpass", "point": "A Site", "callout": "Truck", "options": ["Truck", "Bombsite", "Long A", "Toilets"]},
    {"map": "anubis", "point": "B Site", "callout": "Back Site", "options": ["Back Site", "Water", "Camera", "Main"]},
    {"map": "anubis", "point": "Mid", "callout": "E-Box", "options": ["E-Box", "Gate", "Connector", "Bridge"]},
    {"map": "vertigo", "point": "A Site", "callout": "Sidewalk", "options": ["Sidewalk", "Sandbags", "Ramp", "Generator"]},
    {"map": "vertigo", "point": "B Site", "callout": "Headshot", "options": ["Headshot", "Mid Doors", "Stairs", "Back Plat"]},
    {"map": "train", "point": "B Site", "callout": "Upper B", "options": ["Upper B", "Lower B", "Pop Dog", "Brown Halls"]},
    {"map": "train", "point": "A Site", "callout": "Ivy", "options": ["Ivy", "T Con", "Bomb Train", "Connector"]},
]

# ── Utility Identification ────────────────────────────────────────
UTILITY_QUESTIONS = [
    {"q": "Which utility creates a large opaque cloud blocking vision?", "answer": "Smoke Grenade", "options": ["Smoke Grenade", "Flashbang", "Molotov", "HE Grenade"]},
    {"q": "Which utility blinds enemies looking at it?", "answer": "Flashbang", "options": ["Flashbang", "Smoke Grenade", "Decoy", "Molotov"]},
    {"q": "Which utility damages enemies over time in an area?", "answer": "Molotov / Incendiary", "options": ["Molotov / Incendiary", "HE Grenade", "Smoke Grenade", "Flashbang"]},
    {"q": "Which utility deals instant burst damage?", "answer": "HE Grenade", "options": ["HE Grenade", "Flashbang", "Smoke Grenade", "Decoy Grenade"]},
    {"q": "Which utility fakes gunfire sounds to distract enemies?", "answer": "Decoy Grenade", "options": ["Decoy Grenade", "Flashbang", "Smoke Grenade", "Molotov"]},
    {"q": "CT-side incendiary costs more than T-side Molotov. True or false?", "answer": "True", "options": ["True", "False"]},
    {"q": "A smoke grenade blooming time is approximately how many seconds?", "answer": "~1 second", "options": ["~1 second", "~3 seconds", "~0.3 seconds", "~5 seconds"]},
    {"q": "Which utility can be used to check if enemies are behind a wall (sound)?", "answer": "Decoy Grenade", "options": ["Decoy Grenade", "Flashbang", "Smoke Grenade", "HE Grenade"]},
    {"q": "Max grenades a player can carry (all types combined)?", "answer": "4", "options": ["4", "3", "5", "6"]},
    {"q": "Which utility bounces off walls before activating?", "answer": "HE Grenade", "options": ["HE Grenade", "Molotov", "Smoke (bounces then blooms)", "All of the above"]},
    {"q": "Molotov on T-side costs:", "answer": "$400", "options": ["$400", "$600", "$300", "$200"]},
    {"q": "Smoke grenade on CT side costs:", "answer": "$300", "options": ["$300", "$400", "$200", "$500"]},
    {"q": "Flashbang duration of blindness is approximately:", "answer": "~2-3 seconds (full)", "options": ["~2-3 seconds (full)", "~0.5 seconds", "~5 seconds", "~10 seconds"]},
    {"q": "Which utility is best for retaking a bombsite?", "answer": "Smoke + Flash combo", "options": ["Smoke + Flash combo", "Just HE Grenade", "Decoy only", "Knife only"]},
    {"q": "Pop-flash is a flash that:", "answer": "Detonates right as it enters enemy view", "options": ["Detonates right as it enters enemy view", "Is thrown very high", "Bounces 10 times", "Is a special grenade type"]},
]

# ── Economy Rush ──────────────────────────────────────────────────
# Player has $X, must decide: buy / save / force / eco
ECONOMY_QUESTIONS = [
    {"scenario": "Round 1 (Pistol round). You have $800.", "answer": "Buy armor + utility", "options": ["Buy armor + utility", "Save all $800", "Buy only AK/M4", "Buy deagle + armor"]},
    {"scenario": "Round 2, you won pistol. You have $3200.", "answer": "Buy SMG/shotgun + full util", "options": ["Buy SMG/shotgun + full util", "Force buy AK/M4 + no util", "Save", "Buy AWP"]},
    {"scenario": "Round 2, you lost pistol. You have $1900.", "answer": "Eco (save for round 4)", "options": ["Eco (save for round 4)", "Force buy P250 + armor", "Buy SMG", "Deagle only"]},
    {"scenario": "Round 5, team on a loss streak. You have $2800.", "answer": "Force buy — rifle + armor + some util", "options": ["Force buy — rifle + armor + some util", "Full save", "Buy only pistols", "Save for AWP next round"]},
    {"scenario": "Round 12, you're CT, score 5-6. You have $4750.", "answer": "Full buy: rifle + helmet + full util + kit", "options": ["Full buy: rifle + helmet + full util + kit", "Save — you have enough", "Buy AWP only", "Force buy only SMG"]},
    {"scenario": "Your teammate just died. You have $1800 and it's 3v5.", "answer": "Save the weapon you have, don't peek", "options": ["Save the weapon you have, don't peek", "Aggress peek to trade", "Buy a new rifle", "Use only knife"]},
    {"scenario": "Last round of half, score 14-14, you have $5200.", "answer": "Buy everything — this round decides the half", "options": ["Buy everything — this round decides the half", "Save for second half", "Force buy only", "Buy AWP and no util"]},
    {"scenario": "Round 22, your team is winning 15-6. You have $3100.", "answer": "Buy — close out the game", "options": ["Buy — close out the game", "Eco one more", "Save for next map", "Force buy with P90"]},
    {"scenario": "Opponent saves an AWP. You have $4200. Your team has no money.", "answer": "Buy rifles and coordinate flash peaks on AWPer", "options": ["Buy rifles and coordinate flash peaks on AWPer", "Each person saves individually", "Rush together with no buy", "Buy P90s"]},
    {"scenario": "You just picked up an enemy AK. You have $1500 left.", "answer": "Buy armor + grenades with remaining money", "options": ["Buy armor + grenades with remaining money", "Save remaining money", "Buy a second rifle", "Drop the AK, buy your own"]},
]

# ── Who Said It? ──────────────────────────────────────────────────
# Про-игроки CS и их знаменитые цитаты
QUOTE_QUESTIONS = [
    {"q": "«I will never play this game again. (…) cyka. Let's go.»", "answer": "s1mple", "options": ["s1mple", "device", "NiKo", "olofmeister"]},
    {"q": "«I'm not a god, I'm just a simple player.»", "answer": "s1mple", "options": ["s1mple", "ZywOo", "donk", "m0NESY"]},
    {"q": "«When I was young, I wanted to become a footballer. But I was bad.»", "answer": "NiKo", "options": ["NiKo", "huNter-", "rain", "Twistzz"]},
    {"q": "«I think we should just focus on the game and not on the crowd.»", "answer": "device", "options": ["device", "gla1ve", "dupreeh", "Magisk"]},
    {"q": "«Sometimes it feels like the game is too easy.»", "answer": "ZywOo", "options": ["ZywOo", "s1mple", "donk", "m0NESY"]},
    {"q": "«I like to play aggressive. It's my style.»", "answer": "rain", "options": ["rain", "olofmeister", "f0rest", "GeT_RiGhT"]},
    {"q": "«One tap, one kill, that's the way.»", "answer": "sh1ro", "options": ["sh1ro", "Ax1Le", "electronic", "flamie"]},
    {"q": "«I never give up. Even when we lose, I fight to the end.»", "answer": "olofmeister", "options": ["olofmeister", "Xyp9x", "karrigan", "Fallen"]},
    {"q": "«I am not here to make friends. I am here to win.»", "answer": "coldzera", "options": ["coldzera", "Fallen", "fer", "TACO"]},
    {"q": "«Headshot. Nothing else matters.»", "answer": "donk", "options": ["donk", "m0NESY", "ZywOo", "b1t"]},
    {"q": "«I came from nothing, and I will become everything.»", "answer": "m0NESY", "options": ["m0NESY", "donk", "ropz", "frozen"]},
    {"q": "«AWP is not a weapon, it's an instrument of justice.»", "answer": "kennyS", "options": ["kennyS", "device", "sh1ro", "JW"]},
]

# ── Guess the Map ────────────────────────────────────────────────
# Скриншот карты -> угадать карту
GUESS_MAP_QUESTIONS = [
    {"map": "mirage", "answer": "Mirage", "options": ["Mirage", "Dust II", "Inferno", "Nuke"]},
    {"map": "dust2", "answer": "Dust II", "options": ["Dust II", "Cache", "Mirage", "Overpass"]},
    {"map": "inferno", "answer": "Inferno", "options": ["Inferno", "Anubis", "Vertigo", "Train"]},
    {"map": "nuke", "answer": "Nuke", "options": ["Nuke", "Ancient", "Mirage", "Overpass"]},
    {"map": "ancient", "answer": "Ancient", "options": ["Ancient", "Nuke", "Anubis", "Cache"]},
    {"map": "overpass", "answer": "Overpass", "options": ["Overpass", "Train", "Inferno", "Nuke"]},
    {"map": "anubis", "answer": "Anubis", "options": ["Anubis", "Ancient", "Dust II", "Vertigo"]},
    {"map": "vertigo", "answer": "Vertigo", "options": ["Vertigo", "Overpass", "Nuke", "Anubis"]},
    {"map": "train", "answer": "Train", "options": ["Train", "Cache", "Inferno", "Mirage"]},
    {"map": "cache", "answer": "Cache", "options": ["Cache", "Dust II", "Train", "Ancient"]},
]

GAMES = {
    "reaction": {
        "id": "reaction",
        "title": "Reaction",
        "title_ru": "Реакция",
        "desc": "Watch Top Mid from Window on Mirage. Tap the moment a T peeks! 5 rounds.",
        "desc_ru": "Вид на топ мид из окна Миража. Кликни, как только террор запикает! 5 раундов.",
        "icon": "⚡",
        "kind": "reaction",
        "questions": [],
    },
    "tapboss": {
        "id": "tapboss",
        "title": "Tap Boss",
        "title_ru": "Тапалка",
        "desc": "Tap the pixel CS:GO bosses! Kill them, earn coins and upgrade your damage.",
        "desc_ru": "Тапай пиксельных боссов CS:GO! Убивай их, зарабатывай монеты и прокачивай урон.",
        "icon": "🧨",
        "kind": "tap",
        "questions": [],
    },
}

# Дейли-челлендж: игра дня (по дню года)
DAILY_GAME_IDS = ["reaction", "tapboss"]


def daily_game(day_of_year: int) -> str:
    return DAILY_GAME_IDS[day_of_year % len(DAILY_GAME_IDS)]
