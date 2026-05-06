"""奇门遁甲格局检测 — 反吟伏吟 · 六仪击刑 · 三奇入墓 · 五不遇时 · 三遁

Based on 《烟波钓叟赋》:
  就中伏吟为最凶·天蓬加临地天蓬
  天蓬若到天英上·须知即是反吟宫
  六仪击刑何太凶·甲子直符愁向东
  三奇入墓宜细推·甲日那堪入坤宫
  五不遇时龙不精·时干来克日干上
  天地人分三遁名·生门六丙合六丁
"""

from typing import Dict, List, Optional, Tuple
from .core import DunType, Yuan
from .components import NineStar, EightGate, EightSpirit
from .palaces import Palace


# ── 星基本宫位 ──
STAR_HOME = {
    '天蓬': 1, '天芮': 2, '天冲': 3, '天辅': 4,
    '天禽': 5, '天心': 6, '天柱': 7, '天任': 8, '天英': 9,
}

# ── 对冲宫 ──
OPPOSITE = {1: 9, 9: 1, 2: 8, 8: 2, 3: 7, 7: 3, 4: 6, 6: 4}

# ── 六仪击刑 (地支刑害 → 宫位) ──
# 甲子(戊)子卯刑 → 震3, 甲戌(己)戌未刑 → 坤2, 甲申(庚)申寅刑 → 艮8
# 甲午(辛)午午自刑 → 离9, 甲辰(壬)辰辰自刑 → 巽4, 甲寅(癸)寅巳刑 → 巽4
XING_MAP = {
    '戊': 3,   # 甲子 → 刑在震
    '己': 2,   # 甲戌 → 刑在坤
    '庚': 8,   # 甲申 → 刑在艮
    '辛': 9,   # 甲午 → 刑在离
    '壬': 4,   # 甲辰 → 刑在巽
    '癸': 4,   # 甲寅 → 刑在巽
}

# ── 三奇入墓 ──
# 乙奇属木墓在未 → 坤2, 丙奇属火火墓戌 → 乾6, 丁奇临八 → 艮8
MU_MAP = {'乙': 2, '丙': 6, '丁': 8}

# ── 五不遇时: 时干 → 日干克 ──
WU_BU_YU = {
    '甲': {'庚'}, '乙': {'辛'}, '丙': {'壬'}, '丁': {'癸'}, '戊': {'甲'},
    '己': {'乙'}, '庚': {'丙'}, '辛': {'丁'}, '壬': {'戊'}, '癸': {'己'},
}


def detect_patterns(
    palaces: Dict[int, Palace],
    earth_plate: Dict[int, str],
    day_stem: str,
    hour_stem: str,
) -> Dict[str, List[str]]:
    """
    Detect all classical patterns in a Qimen plate.

    Returns:
        Dict with keys: '伏吟', '反吟', '六仪击刑', '三奇入墓', '五不遇时', '天遁', '地遁', '人遁'
        Each value is a list of descriptions (empty list = pattern not present).
    """
    results: Dict[str, List[str]] = {}

    # ── 伏吟 (star returns to home palace) ──
    fu_yin = []
    for num in range(1, 10):
        p = palaces.get(num)
        if p and p.star:
            star_name = p.star.chinese
            home = STAR_HOME.get(star_name)
            if home and str(num) == str(home):
                fu_yin.append(f'{star_name}在{star_name}本宫')
    results['伏吟'] = fu_yin

    # ── 反吟 (star in opposite palace) ──
    fan_yin = []
    for num in range(1, 10):
        p = palaces.get(num)
        if p and p.star:
            star_name = p.star.chinese
            home = STAR_HOME.get(star_name)
            opp = OPPOSITE.get(int(home)) if home else None
            if opp and str(num) == str(opp):
                fan_yin.append(f'{star_name}在{OPPOSITE.get(num, "对宫")}宫')
    results['反吟'] = fan_yin

    # ── 六仪击刑 ──
    ji_xing = []
    for num in range(1, 10):
        stem = earth_plate.get(num)
        if stem and stem in XING_MAP and int(num) == XING_MAP[stem]:
            jia = {'戊': '甲子', '己': '甲戌', '庚': '甲申', '辛': '甲午', '壬': '甲辰', '癸': '甲寅'}.get(stem, '')
            ji_xing.append(f'{jia}({stem})居{num}宫击刑')
    results['六仪击刑'] = ji_xing

    # ── 三奇入墓: 天盘奇仪入墓 ──
    ru_mu = []
    for num in range(1, 10):
        p = palaces.get(num)
        if p:
            heaven = p.heaven_plate_stem
            if heaven in MU_MAP and int(num) == MU_MAP[heaven]:
                ru_mu.append(f'{heaven}奇入{num}宫墓')
        # Also check earth plate for 三奇
    results['三奇入墓'] = ru_mu

    # ── 五不遇时 ──
    blocked = WU_BU_YU.get(day_stem, set())
    wu_bu_yu = []
    if hour_stem in blocked:
        wu_bu_yu.append(f'日{day_stem}时{hour_stem}五不遇时')
    results['五不遇时'] = wu_bu_yu

    # ── 三遁 ──
    san_dun = []
    for num in range(1, 10):
        p = palaces.get(num)
        if not p or not p.gate:
            continue
        gate = p.gate.chinese
        heaven = p.heaven_plate_stem
        earth = p.earth_plate_stem if hasattr(p, 'earth_plate_stem') else None
        spirit = p.spirit.chinese if p.spirit else ''

        # 天遁: 生门 + 天丙 or 地丁 (生门六丙合六丁)
        if gate == '生门' and (heaven == '丙' or earth == '丁'):
            san_dun.append(f'宫{num}天遁(生门+{"六丙" if heaven=="丙" else "六丁"})')

        # 地遁: 开门 + 天乙 or 地己 (开门六乙合六己)
        if gate == '开门' and (heaven == '乙' or earth == '己'):
            san_dun.append(f'宫{num}地遁(开门+{"六乙" if heaven=="乙" else "六己"})')

        # 人遁: 休门 + 天丁 + 太阴 (休门六丁共太阴)
        if gate == '休门' and heaven == '丁' and '太阴' in spirit:
            san_dun.append(f'宫{num}人遁(休门+六丁+太阴)')

    results['天遁'] = [d for d in san_dun if '天遁' in d]
    results['地遁'] = [d for d in san_dun if '地遁' in d]
    results['人遁'] = [d for d in san_dun if '人遁' in d]

    return results
