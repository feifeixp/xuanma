'use client';

import { motion } from 'framer-motion';
import { Star, DoorOpen, Eye } from 'lucide-react';
import type { PalaceData } from '@/lib/qimen-types';

interface Label {
  trigram: string;
  name: string;
  direction: string;
  element: string;
  elementEmoji: string;
}

interface Props {
  palace: PalaceData | null;
  label: Label;
  index: number;
  isCenter: boolean;
}

export default function Palace({ palace, label, index, isCenter }: Props) {
  // 根据吉凶决定配色
  const starAuspicious = palace?.star?.is_auspicious !== false;
  const gateAuspicious = palace?.gate?.is_auspicious !== false;
  const hasAuspiciousGlow = starAuspicious && gateAuspicious;
  const hasInauspiciousGlow = !starAuspicious || !gateAuspicious;

  if (!palace) {
    return (
      <motion.div
        className="aspect-square border border-bronze-dim/10 rounded-sm flex items-center justify-center bg-surface/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <div className="text-center text-bronze-dim/30">
          <div className="text-2xl mb-1">{label.trigram}</div>
          <div className="text-xs">{label.name}宫</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`
        relative aspect-square rounded-sm cursor-pointer overflow-hidden
        border transition-all duration-300
        ${isCenter ? 'bg-surface/30 border-bronze-dim/10' : 'bg-surface/40 border-bronze-dim/15 hover:border-bronze-glow/40'}
        ${hasAuspiciousGlow ? 'shadow-[0_0_15px_rgba(91,140,90,0.1)] hover:shadow-[0_0_25px_rgba(91,140,90,0.25)]' : ''}
        ${hasInauspiciousGlow && !hasAuspiciousGlow ? 'shadow-[0_0_10px_rgba(232,69,60,0.08)] hover:shadow-[0_0_20px_rgba(232,69,60,0.2)]' : ''}
      `}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{
        scale: 1.05,
        borderColor: 'rgba(212,168,83,0.5)',
        boxShadow: '0 0 30px rgba(212,168,83,0.25)',
      }}
    >
      {/* 宫位底色 */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-bronze-dim/5" />

      {/* 宫位号 + 八卦 */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1.5">
        <span className="text-[10px] text-bronze-dim/50 font-mono">{palace.number}</span>
        <span className="text-lg text-bronze-dim/30 leading-none">{label.trigram}</span>
      </div>

      {/* 方位 + 五行 */}
      <div className="absolute top-1.5 right-2 text-right">
        <div className="text-[9px] text-bronze-dim/40">{label.direction}</div>
        <div className="text-[9px] text-bronze-dim/30">{label.elementEmoji}</div>
      </div>

      {/* 中央：天干 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {/* 天盘天干（大） */}
          <div className={`
            text-2xl font-display leading-none mb-0.5
            ${hasAuspiciousGlow ? 'text-jade' : hasInauspiciousGlow && !starAuspicious ? 'text-vermilion' : 'text-text-primary'}
          `}>
            {palace.heaven_stem}
          </div>
          {/* 地盘天干（小） */}
          <div className="text-xs text-bronze-dim/60 leading-none">
            {palace.earth_stem}
          </div>
        </div>
      </div>

      {/* 星 */}
      {palace.star && (
        <div className={`
          absolute bottom-1.5 left-1.5 flex items-center gap-0.5 text-[9px] leading-none
          ${palace.star.is_auspicious ? 'text-jade/70' : 'text-vermilion/70'}
        `}>
          <Star className="w-2.5 h-2.5" />
          <span className="font-display">{palace.star.chinese.replace(/（.*）/, '')}</span>
        </div>
      )}

      {/* 门 */}
      {palace.gate && (
        <div className={`
          absolute bottom-1.5 right-1.5 flex items-center gap-0.5 text-[9px] leading-none
          ${palace.gate.is_auspicious ? 'text-jade/70' : 'text-vermilion/70'}
        `}>
          <DoorOpen className="w-2.5 h-2.5" />
          <span className="font-display">{palace.gate.chinese.replace(/（.*）/, '')}</span>
        </div>
      )}

      {/* 神 */}
      {palace.spirit && (
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2 text-[8px] leading-none
          ${palace.spirit.is_auspicious ? 'text-jade/40' : 'text-vermilion/40'}
        `}>
          <span className="font-display">{palace.spirit.chinese.replace(/（.*）/, '')}</span>
        </div>
      )}

      {/* 三奇标记 */}
      {palace.has_three_wonders && (
        <div className="absolute -top-1 -right-1">
          <motion.div
            className="w-4 h-4 rounded-full bg-jade/20 border border-jade/40 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[6px] text-jade">奇</span>
          </motion.div>
        </div>
      )}

      {/* Hover 涟漪效果 */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-bronze-primary/5 to-transparent" />
      </div>
    </motion.div>
  );
}
