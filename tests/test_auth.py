import time
from types import SimpleNamespace
from urllib.parse import parse_qsl, urlencode

from tests.conftest import TEST_TOKEN, make_init_data

from bot.web_server import _auth, _validate_init_data


def _req(init_data: str | None):
    return SimpleNamespace(
        headers={"x-init-data": init_data} if init_data else {},
        query={},
    )


def test_valid_init_data():
    init = make_init_data()
    assert _validate_init_data(init) is not None


def test_tampered_init_data_rejected():
    init = make_init_data()
    pairs = dict(parse_qsl(init))
    old_hash = pairs["hash"]
    pairs["user"] = '{"id":999,"first_name":"Evil"}'
    pairs["hash"] = old_hash
    tampered = urlencode(pairs)
    assert _validate_init_data(tampered) is None


def test_missing_hash_rejected():
    init = make_init_data().split("&hash=")[0]
    assert _validate_init_data(init) is None


def test_expired_init_data_rejected():
    init = make_init_data(auth_date=int(time.time()) - 200000)
    assert _validate_init_data(init) is None


def test_wrong_token_rejected():
    init = make_init_data(token="999:WRONG")
    assert _validate_init_data(init) is None


def test_auth_returns_user_id():
    init = make_init_data(user_id=777, first_name="Petya")
    result = _auth(_req(init))
    assert result == (777, "Petya")


def test_auth_rejects_bad_header():
    assert _auth(_req("garbage")) is None


def test_auth_rejects_missing_header():
    assert _auth(_req(None)) is None
