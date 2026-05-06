'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AIInterpretPanel from '@/components/AIInterpret/AIInterpretPanel';
import { getCurrentChart, interpretStreamFetch } from '@/lib/api';
import type { ChartData, QuestionType } from '@/lib/qimen-types';

export default function InterpretPage() {
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType>('general');

  const handleInterpret = async (questionType: QuestionType, customQuestion?: string) => {
    setSelectedQuestion(questionType);
    setAiText('');
    setAiLoading(true);

    try {
      const chart = await getCurrentChart();
      await interpretStreamFetch(chart, questionType, {
        onToken: (token) => setAiText((prev) => prev + token),
        onDone: () => setAiLoading(false),
        onError: (err) => {
          setAiText(`解读出错：${err}`);
          setAiLoading(false);
        },
      }, customQuestion);
    } catch (e) {
      setAiText('无法连接服务器，请确保后端已启动。');
      setAiLoading(false);
    }
  };

  return (
    <main className="relative z-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl text-bronze-primary mb-2 tracking-wider">
            AI 解盘
          </h2>
          <p className="text-text-secondary text-sm">
            选择你想了解的方向，AI 大师即刻为你解读当前时刻的奇门盘面
          </p>
        </motion.div>

        <AIInterpretPanel
          text={aiText}
          loading={aiLoading}
          onClose={() => {}}
          onQuestionSelect={handleInterpret}
          selectedQuestion={selectedQuestion}
        />
      </div>
    </main>
  );
}
