'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handleQuickChart = () => {
    const now = new Date().toISOString();
    router.push(`/chart?datetime=${encodeURIComponent(now)}`);
  };

  const handleCustomChart = () => {
    if (selectedDate) {
      router.push(`/chart?datetime=${encodeURIComponent(selectedDate)}`);
    }
  };

  return (
    <main className="relative z-10">
      {/* ── Hero Section ── */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
        {/* 浮动装饰光环 */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,168,83,0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 主标题 */}
        <motion.h1
          className="font-display text-7xl md:text-8xl lg:text-9xl tracking-[0.15em] mb-6 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="bg-gradient-to-b from-bronze-glow via-bronze-primary to-bronze-dim bg-clip-text text-transparent">
            玄码
          </span>
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          className="text-xl md:text-2xl text-text-secondary font-light mb-2 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          奇门遁甲 · AI 智能解读
        </motion.p>

        <motion.p
          className="text-sm text-bronze-dim/60 mb-12 font-display tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          此时此刻，天机何在？
        </motion.p>

        {/* 快速起盘按钮 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button
            onClick={handleQuickChart}
            className="group relative px-10 py-4 bg-bronze-primary text-cosmic-deep font-bold text-lg rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,168,83,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              即刻起盘
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* 扫光效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-10 py-4 border border-bronze-dim/30 text-bronze-primary rounded-sm hover:border-bronze-glow hover:text-bronze-glow transition-all duration-300 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            择时起盘
          </button>
        </motion.div>

        {/* 日期选择器 */}
        <AnimatePresence>
          {showDatePicker && (
            <motion.div
              className="mt-6 flex gap-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="datetime-local"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-surface border border-bronze-dim/30 text-text-primary rounded-sm focus:border-bronze-glow outline-none"
              />
              <button
                onClick={handleCustomChart}
                disabled={!selectedDate}
                className="px-6 py-2 bg-bronze-primary text-cosmic-deep font-semibold rounded-sm disabled:opacity-30 hover:bg-bronze-glow transition-colors"
              >
                起盘
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 装饰性九宫格暗示 */}
        <motion.div
          className="mt-20 grid grid-cols-3 gap-1 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          {['巽', '离', '坤', '震', '中', '兑', '艮', '坎', '乾'].map((char, i) => (
            <motion.div
              key={i}
              className="w-16 h-16 border border-bronze-dim/40 flex items-center justify-center font-display text-bronze-dim text-xl"
              whileHover={{
                scale: 1.15,
                borderColor: 'rgba(212,168,83,0.6)',
                color: 'rgba(212,168,83,0.8)',
                boxShadow: '0 0 20px rgba(212,168,83,0.2)',
              }}
              transition={{ duration: 0.3 }}
            >
              {char}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 滚动提示 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-bronze-dim/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </main>
  );
}
