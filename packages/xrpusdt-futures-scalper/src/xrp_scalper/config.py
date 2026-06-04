from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class TradingConfig:
    dry_run: bool
    testnet: bool
    position_notional_usdt: float
    leverage: int
    take_profit_bps: float
    stop_loss_bps: float
    max_hold_seconds: int
    cooldown_seconds: int


@dataclass(frozen=True)
class RiskConfig:
    max_daily_loss_usdt: float
    max_consecutive_losses: int
    max_spread_bps: float
    min_signal_strength_bps: float


@dataclass(frozen=True)
class StrategyConfig:
    fast_ema: int
    slow_ema: int
    trend_ema: int


@dataclass(frozen=True)
class AppConfig:
    symbol: str
    stream_interval: str
    trading: TradingConfig
    risk: RiskConfig
    strategy: StrategyConfig
    api_key: str
    api_secret: str


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def load_config(path: Path) -> AppConfig:
    load_dotenv(path.parent / ".env")
    data: dict[str, Any] = json.loads(path.read_text(encoding="utf-8"))
    trading = data["trading"]
    risk = data["risk"]
    strategy = data["strategy"]

    return AppConfig(
        symbol=data.get("symbol", "XRPUSDT").upper(),
        stream_interval=data.get("stream_interval", "1m"),
        trading=TradingConfig(
            dry_run=bool(trading.get("dry_run", True)),
            testnet=bool(trading.get("testnet", True)),
            position_notional_usdt=float(trading["position_notional_usdt"]),
            leverage=int(trading.get("leverage", 1)),
            take_profit_bps=float(trading["take_profit_bps"]),
            stop_loss_bps=float(trading["stop_loss_bps"]),
            max_hold_seconds=int(trading["max_hold_seconds"]),
            cooldown_seconds=int(trading["cooldown_seconds"]),
        ),
        risk=RiskConfig(
            max_daily_loss_usdt=float(risk["max_daily_loss_usdt"]),
            max_consecutive_losses=int(risk["max_consecutive_losses"]),
            max_spread_bps=float(risk["max_spread_bps"]),
            min_signal_strength_bps=float(risk["min_signal_strength_bps"]),
        ),
        strategy=StrategyConfig(
            fast_ema=int(strategy["fast_ema"]),
            slow_ema=int(strategy["slow_ema"]),
            trend_ema=int(strategy["trend_ema"]),
        ),
        api_key=os.getenv("BINANCE_API_KEY", ""),
        api_secret=os.getenv("BINANCE_API_SECRET", ""),
    )

