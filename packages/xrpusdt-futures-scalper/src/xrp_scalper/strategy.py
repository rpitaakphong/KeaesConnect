from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from .config import RiskConfig, StrategyConfig


class Side(str, Enum):
    BUY = "BUY"
    SELL = "SELL"


@dataclass(frozen=True)
class Signal:
    side: Side | None
    strength_bps: float
    reason: str


class EmaScalpStrategy:
    def __init__(self, config: StrategyConfig, risk: RiskConfig) -> None:
        self.config = config
        self.risk = risk
        self.fast: float | None = None
        self.slow: float | None = None
        self.trend: float | None = None
        self.previous_fast: float | None = None
        self.previous_slow: float | None = None

    def update(self, close_price: float) -> Signal:
        self.previous_fast = self.fast
        self.previous_slow = self.slow
        self.fast = self._ema(self.fast, close_price, self.config.fast_ema)
        self.slow = self._ema(self.slow, close_price, self.config.slow_ema)
        self.trend = self._ema(self.trend, close_price, self.config.trend_ema)

        if self.previous_fast is None or self.previous_slow is None or self.trend is None:
            return Signal(None, 0, "warming_up")

        strength_bps = abs((self.fast - self.slow) / close_price) * 10_000
        if strength_bps < self.risk.min_signal_strength_bps:
            return Signal(None, strength_bps, "weak_signal")

        crossed_up = self.previous_fast <= self.previous_slow and self.fast > self.slow
        crossed_down = self.previous_fast >= self.previous_slow and self.fast < self.slow

        if crossed_up and close_price > self.trend:
            return Signal(Side.BUY, strength_bps, "ema_cross_up_with_trend")
        if crossed_down and close_price < self.trend:
            return Signal(Side.SELL, strength_bps, "ema_cross_down_with_trend")
        return Signal(None, strength_bps, "no_cross")

    @staticmethod
    def _ema(previous: float | None, value: float, period: int) -> float:
        if previous is None:
            return value
        alpha = 2 / (period + 1)
        return (value * alpha) + (previous * (1 - alpha))

