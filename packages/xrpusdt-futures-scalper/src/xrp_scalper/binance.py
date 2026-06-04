from __future__ import annotations

import hashlib
import hmac
import json
import ssl
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from decimal import Decimal, ROUND_DOWN
from typing import Any

import certifi


PROD_REST_URL = "https://fapi.binance.com"
TESTNET_REST_URL = "https://testnet.binancefuture.com"
PROD_WS_URL = "wss://fstream.binance.com"
TESTNET_WS_URL = "wss://stream.binancefuture.com"


@dataclass(frozen=True)
class SymbolRules:
    min_qty: Decimal
    step_size: Decimal
    tick_size: Decimal
    min_notional: Decimal


class BinanceFuturesClient:
    def __init__(self, api_key: str, api_secret: str, testnet: bool) -> None:
        self.api_key = api_key
        self.api_secret = api_secret.encode("utf-8")
        self.base_url = TESTNET_REST_URL if testnet else PROD_REST_URL
        self.ssl_context = ssl.create_default_context(cafile=certifi.where())

    def public_get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        url = self._url(path, params or {})
        with urllib.request.urlopen(url, timeout=10, context=self.ssl_context) as response:
            return json.loads(response.read().decode("utf-8"))

    def signed_request(self, method: str, path: str, params: dict[str, Any]) -> Any:
        if not self.api_key or not self.api_secret:
            raise RuntimeError("Missing BINANCE_API_KEY or BINANCE_API_SECRET")

        payload = dict(params)
        payload["timestamp"] = int(time.time() * 1000)
        payload.setdefault("recvWindow", 5000)
        query = urllib.parse.urlencode(payload, doseq=True)
        signature = hmac.new(self.api_secret, query.encode("utf-8"), hashlib.sha256).hexdigest()
        body = f"{query}&signature={signature}".encode("utf-8")
        request = urllib.request.Request(
            self.base_url + path,
            data=body if method.upper() in {"POST", "DELETE", "PUT"} else None,
            method=method.upper(),
            headers={"X-MBX-APIKEY": self.api_key, "Content-Type": "application/x-www-form-urlencoded"},
        )
        if method.upper() == "GET":
            request.full_url = f"{self.base_url}{path}?{body.decode('utf-8')}"

        try:
            with urllib.request.urlopen(request, timeout=10, context=self.ssl_context) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8")
            raise RuntimeError(f"Binance API error {exc.code}: {detail}") from exc

    def exchange_info(self) -> Any:
        return self.public_get("/fapi/v1/exchangeInfo")

    def book_ticker(self, symbol: str) -> Any:
        return self.public_get("/fapi/v1/ticker/bookTicker", {"symbol": symbol})

    def symbol_rules(self, symbol: str) -> SymbolRules:
        exchange = self.exchange_info()
        info = next(item for item in exchange["symbols"] if item["symbol"] == symbol)
        filters = {item["filterType"]: item for item in info["filters"]}
        lot = filters["LOT_SIZE"]
        price = filters["PRICE_FILTER"]
        notional = filters.get("MIN_NOTIONAL", {"notional": "5"})
        return SymbolRules(
            min_qty=Decimal(lot["minQty"]),
            step_size=Decimal(lot["stepSize"]),
            tick_size=Decimal(price["tickSize"]),
            min_notional=Decimal(notional["notional"]),
        )

    def market_order(self, symbol: str, side: str, quantity: Decimal, reduce_only: bool = False) -> Any:
        params: dict[str, Any] = {
            "symbol": symbol,
            "side": side,
            "type": "MARKET",
            "quantity": format(quantity, "f"),
            "newOrderRespType": "RESULT",
        }
        if reduce_only:
            params["reduceOnly"] = "true"
        return self.signed_request("POST", "/fapi/v1/order", params)

    def set_leverage(self, symbol: str, leverage: int) -> Any:
        return self.signed_request("POST", "/fapi/v1/leverage", {"symbol": symbol, "leverage": leverage})

    @staticmethod
    def round_qty(quantity: Decimal, rules: SymbolRules) -> Decimal:
        steps = (quantity / rules.step_size).to_integral_value(rounding=ROUND_DOWN)
        rounded = steps * rules.step_size
        return rounded if rounded >= rules.min_qty else Decimal("0")

    def _url(self, path: str, params: dict[str, Any]) -> str:
        query = urllib.parse.urlencode(params)
        return f"{self.base_url}{path}" + (f"?{query}" if query else "")


def websocket_url(symbol: str, interval: str, testnet: bool) -> str:
    base = TESTNET_WS_URL if testnet else PROD_WS_URL
    stream = f"{symbol.lower()}@kline_{interval}"
    if testnet:
        return f"{base}/stream?streams={stream}"
    return f"{base}/market/stream?streams={stream}"
