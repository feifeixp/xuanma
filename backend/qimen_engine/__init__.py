"""
Qimen Dunjia Engine - Vendored from Maximilian-Winter/Qimen-Dunjia

Usage:
    from qimen_engine import QimenDunjia
    engine = QimenDunjia()
    plate = engine.calculate(datetime.now())
"""
from .qimen import QimenDunjia, NineStars, EightGates, EightSpirits

__all__ = ['QimenDunjia', 'NineStars', 'EightGates', 'EightSpirits']
