'use client';

import { motion } from 'framer-motion';

export default function CasesPage() {
  return (
    <main className="relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl text-bronze-primary mb-4 tracking-wider">
            案例库
          </h2>
          <p className="text-text-secondary">
            经典奇门遁甲案例与解析 · 即将上线
          </p>
          <div className="mt-12 p-12 border border-bronze-dim/10 rounded-sm bg-surface/20">
            <p className="text-bronze-dim/40 font-display text-lg">道藏三式 · 玄码归一</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
