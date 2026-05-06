"""Core engine wrapper — serializes QimenDunjia plate data for API"""

from datetime import datetime
from typing import Dict, Any, Optional

from qimen_engine import QimenDunjia


_engine: Optional[QimenDunjia] = None


def get_engine() -> QimenDunjia:
    global _engine
    if _engine is None:
        _engine = QimenDunjia()
    return _engine


def _to_json_safe(val):
    """Recursively convert Enum values to their .value"""
    if val is None:
        return None
    if isinstance(val, (str, int, float, bool)):
        return val
    if isinstance(val, (list, tuple)):
        return [_to_json_safe(v) for v in val]
    if hasattr(val, "value"):
        return val.value
    return str(val)


def serialize_component(comp) -> Dict[str, Any]:
    """Serialize a star/gate/spirit component to dict"""
    if comp is None:
        return None
    data = {"chinese": getattr(comp, "chinese", str(comp)),
            "pinyin": getattr(comp, "pinyin", "")}
    for attr in ("element", "description", "nature", "is_auspicious",
                 "auspiciousness", "strategic_meaning", "polarity",
                 "favorable_for", "unfavorable_for", "indicates", "warnings",
                 "gate_type", "spirit_type", "star_type", "base_palace"):
        if hasattr(comp, attr):
            data[attr] = _to_json_safe(getattr(comp, attr))
    return data


def serialize_plate(plate) -> Dict[str, Any]:
    """Serialize full QimenPlate to JSON-safe dict"""
    summary = plate.get_summary()

    palaces = {}
    for num in range(1, 10):
        p = plate.palaces.get(num)
        if p is None:
            palaces[str(num)] = None
            continue
        palaces[str(num)] = {
            "number": p.number,
            "trigram": p.trigram.value[0] if p.trigram and hasattr(p.trigram, 'value') and isinstance(p.trigram.value, (tuple, list)) else (str(p.trigram) if p.trigram else None),
            "direction": p.direction.value if p.direction and hasattr(p.direction, 'value') else str(p.direction) if p.direction else None,
            "element": p.element.value if p.element and hasattr(p.element, 'value') else str(p.element) if p.element else None,
            "earth_stem": p.earth_plate_stem,
            "heaven_stem": p.heaven_plate_stem,
            "star": serialize_component(p.star),
            "gate": serialize_component(p.gate),
            "spirit": serialize_component(p.spirit),
            "has_three_wonders": p.has_three_wonders() if callable(p.has_three_wonders) else bool(p.has_three_wonders),
        }

    return {
        "palaces": palaces,
        "dun_type": summary.get("dun_type"),
        "yuan": summary.get("yuan"),
        "ju_number": summary.get("ju_number"),
        "solar_term": summary.get("solar_term"),
        "duty_star": summary.get("duty_star"),
        "duty_gate": summary.get("duty_gate"),
        "duty_palace": summary.get("duty_palace"),
        "four_pillars": {
            "year": summary["four_pillars"].get("year"),
            "month": summary["four_pillars"].get("month"),
            "day": summary["four_pillars"].get("day"),
            "hour": summary["four_pillars"].get("hour"),
        },
    }


def calculate_chart(dt: Optional[datetime] = None) -> Dict[str, Any]:
    """Calculate Qimen Dunjia chart for given datetime (default: now)"""
    engine = get_engine()
    if dt is None:
        dt = datetime.now()
    plate = engine.calculate(dt)
    return serialize_plate(plate)
