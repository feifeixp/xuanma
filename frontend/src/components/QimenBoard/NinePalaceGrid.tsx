'use client';

import { motion } from 'framer-motion';
import Palace from './Palace';
import type { ChartData } from '@/lib/qimen-types';

interface Props {
  chartData: ChartData;
}

const PALACE_LABELS: Record<string, { trigram: string; name: string; direction: string; element: string; elementEmoji: string }> = {
  '1': { trigram: '☵', name: '坎', direction: '北', element: '水', elementEmoji: '💧' },
  '2': { trigram: '☷', name: '坤', direction: '西南', element: '土', elementEmoji: '⛰️' },
  '3': { trigram: '☳', name: '震', direction: '东', element: '木', elementEmoji: '🌳' },
  '4': { trigram: '☴', name: '巽', direction: '东南', element: '木', elementEmoji: '🌿' },
  '5': { trigram: '☯', name: '中', direction: '中', element: '土', elementEmoji: '🟤' },
  '6': { trigram: '☰', name: '乾', direction: '西北', element: '金', elementEmoji: '⚜️' },
  '7': { trigram: '☱', name: '兑', direction: '西', element: '金', elementEmoji: '🔶' },
  '8': { trigram: '☶', name: '艮', direction: '东北', element: '土', elementEmoji: '🏔️' },
  '9': { trigram: '☲', name: '离', direction: '南', element: '火', elementEmoji: '🔥' },
};

// 后天文王八卦九宫布局: 4 9 2 / 3 5 7 / 8 1 6
const GRID_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export default function NinePalaceGrid({ chartData }: Props) {
  return (
    <div className="relative">
      {/* 外层发光环 */}
      <motion.div
        className="absolute -inset-8 rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,168,83,0.15) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 九天十地装饰文字 */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-bronze-dim/30 text-xs font-display tracking-[0.3em]">
        九 天 玄 码
      </div>

      {/* 九宫格主体 */}
      <motion.div
        className="relative grid grid-cols-3 gap-2 max-w-[520px] mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {GRID_ORDER.map((num, index) => {
          const palace = chartData.palaces[String(num)];
          const label = PALACE_LABELS[String(num)];

          return (
            <Palace
              key={num}
              palace={palace}
              label={label}
              index={index}
              isCenter={num === 5}
            />
          );
        })}
      </motion.div>

      {/* 底部天地人神标识 */}
      <div className="flex justify-center gap-8 mt-6 text-xs text-bronze-dim/40 font-display tracking-widest">
        <span>天·星</span>
        <span>地·奇仪</span>
        <span>人·八门</span>
        <span>神·八神</span>
      </div>
    </div>
  );
}
