/* ── 奇门遁甲盘面类型定义 ── */

export interface ComponentInfo {
  chinese: string;
  pinyin: string;
  element?: string;
  description?: string;
  nature?: string;
  is_auspicious?: boolean;
  auspiciousness?: string;
  strategic_meaning?: string;
  polarity?: string;
  favorable_for?: string[];
  unfavorable_for?: string[];
  indicates?: string;
  warnings?: string;
  gate_type?: number;
  spirit_type?: number;
  star_type?: number;
  base_palace?: number;
}

export interface PalaceData {
  number: number;
  trigram: string | string[] | null;
  direction: string | null;
  element: string | null;
  earth_stem: string;
  heaven_stem: string;
  star: ComponentInfo | null;
  gate: ComponentInfo | null;
  spirit: ComponentInfo | null;
  has_three_wonders: boolean;
}

export interface FourPillars {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export interface ChartData {
  palaces: Record<string, PalaceData | null>;
  dun_type: string;
  yuan: string;
  ju_number: number;
  solar_term: string;
  duty_star: string;
  duty_gate: string;
  duty_palace: number;
  four_pillars: FourPillars;
}

export interface ChartResponse {
  chart: ChartData;
}

export type QuestionType = 'general' | 'career' | 'relationship' | 'health' | 'wealth';
