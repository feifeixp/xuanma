'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Calendar, RefreshCw } from 'lucide-react';
import NinePalaceGrid from '@/components/QimenBoard/NinePalaceGrid';
import AIInterpretPanel from '@/components/AIInterpret/AIInterpretPanel';
import { calculateChart, getCurrentChart, interpretStreamFetch } from '@/lib/api';
import type { ChartData, QuestionType } from '@/lib/qimen-types';

export default function ChartContent() {
  const searchParams = useSearchParams();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType>('general');

  const loadChart = useCallback(async (datetime?: string) => {
    setLoading(true);
    setError(null);
    setShowAI(false);
    setAiText('');
    try {
      const chart = datetime
        ? await calculateChart(datetime)
        : await getCurrentChart();
      setChartData(chart);
    } catch (e) {
      setError(e instanceof Error ? e.message : '无法连接服务器');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const dt = searchParams.get('datetime');
    loadChart(dt || undefined);
  }, [searchParams, loadChart]);

  const handleRefresh = () => {
    setSelectedDate('');
    loadChart();
  };

  const handleCustomChart = () => {
    if (selectedDate) {
      loadChart(selectedDate);
    }
  };

  const handleAIInterpret = async (questionType: QuestionType, customQuestion?: string) => {
    if (!chartData) return;
    setSelectedQuestion(questionType);
    setShowAI(true);
    setAiText('');
    setAiLoading(true);

    await interpretStreamFetch(chartData, questionType, {
      onToken: (token) => setAiText((prev) => prev + token),
      onDone: () => setAiLoading(false),
      onError: (err) => {
        setAiText(`解读出错：${err}`);
        setAiLoading(false);
      },
    }, customQuestion);
  };

  const handleCloseAI = () => {
    setShowAI(false);
    setAiText('');
  };

  return (
    <main className="relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── 顶部工具栏 ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl text-bronze-primary mb-1 tracking-wider">
              奇门九宫
            </h2>
            {chartData && (
              <p className="text-sm text-text-secondary">
                {chartData.solar_term} · {chartData.dun_type} · {chartData.yuan} · 
                局{chartData.ju_number} · 值符{chartData.duty_star} · 值使{chartData.duty_gate}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-surface border border-bronze-dim/30 text-text-primary text-sm rounded-sm focus:border-bronze-glow outline-none"
              />
              <button
                onClick={handleCustomChart}
                disabled={!selectedDate}
                className="px-3 py-1.5 bg-bronze-primary text-cosmic-deep text-sm font-semibold rounded-sm disabled:opacity-30 hover:bg-bronze-glow transition-colors"
              >
                起盘
              </button>
            </div>
            <button
              onClick={handleRefresh}
              className="p-1.5 text-bronze-dim hover:text-bronze-glow transition-colors"
              title="当前时刻"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 错误状态 ── */}
        {error && (
          <div className="text-center py-12">
            <p className="text-vermilion mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 border border-vermilion/30 text-vermilion rounded-sm hover:bg-vermilion/10 transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {/* ── 加载状态 ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <motion.div
              className="w-24 h-24 border-2 border-bronze-primary/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                borderTopColor: 'rgba(212,168,83,0.8)',
              }}
            />
            <p className="mt-6 text-text-secondary text-sm">推演天机...</p>
          </div>
        )}

        {/* ── 盘面展示 ── */}
        {chartData && !loading && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 九宫罗盘 */}
            <div className="flex-1">
              <NinePalaceGrid chartData={chartData} />
            </div>

            {/* AI 解盘面板 */}
            <AnimatePresence>
              {showAI && (
                <motion.div
                  className="lg:w-[420px] flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AIInterpretPanel
                    text={aiText}
                    loading={aiLoading}
                    onClose={handleCloseAI}
                    onQuestionSelect={handleAIInterpret}
                    selectedQuestion={selectedQuestion}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI 触发按钮 (面板未打开时) */}
            {!showAI && (
              <div className="lg:w-[280px] flex-shrink-0">
                <div className="sticky top-8 p-6 bg-surface/60 border border-bronze-dim/20 rounded-sm backdrop-blur-sm">
                  <h3 className="font-display text-lg text-bronze-primary mb-4">AI 解读</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    选择你想了解的方向，AI 大师为你解读盘面。
                  </p>
                  <div className="space-y-2">
                    {([
                      ['综合解读', 'general'],
                      ['事业运势', 'career'],
                      ['感情人际', 'relationship'],
                      ['健康养生', 'health'],
                      ['财运分析', 'wealth'],
                    ] as [string, QuestionType][]).map(([label, type]) => (
                      <button
                        key={type}
                        onClick={() => handleAIInterpret(type)}
                        className="w-full px-4 py-2.5 text-left text-sm border border-bronze-dim/20 rounded-sm text-text-secondary hover:text-bronze-glow hover:border-bronze-glow/30 transition-all duration-200"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 四柱信息 ── */}
        {chartData && !loading && (
          <motion.div
            className="mt-8 p-4 bg-surface/40 border border-bronze-dim/10 rounded-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs text-bronze-dim/60 font-display tracking-widest mr-4">四柱</span>
            <span className="text-sm text-text-secondary">
              {chartData.four_pillars.year}年 {chartData.four_pillars.month}月{' '}
              {chartData.four_pillars.day}日 {chartData.four_pillars.hour}时
            </span>
          </motion.div>
        )}
      </div>
    </main>
  );
}
