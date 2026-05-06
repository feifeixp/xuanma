'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Sparkles } from 'lucide-react';
import type { QuestionType } from '@/lib/qimen-types';

interface Props {
  text: string;
  loading: boolean;
  onClose: () => void;
  onQuestionSelect: (type: QuestionType, custom?: string) => void;
  selectedQuestion: QuestionType;
}

const QUESTION_BUTTONS: [string, QuestionType][] = [
  ['综合解读', 'general'],
  ['事业运势', 'career'],
  ['感情人际', 'relationship'],
  ['健康养生', 'health'],
  ['财运分析', 'wealth'],
];

export default function AIInterpretPanel({
  text,
  loading,
  onClose,
  onQuestionSelect,
  selectedQuestion,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新文字
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div className="bg-surface/80 border border-bronze-dim/20 rounded-sm backdrop-blur-md overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
      {/* 面板头部 */}
      <div className="flex items-center justify-between p-4 border-b border-bronze-dim/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-bronze-primary" />
          <h3 className="font-display text-bronze-primary tracking-wider">AI 大师解读</h3>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 问题类型选择 */}
      <div className="flex gap-1.5 p-3 border-b border-bronze-dim/10 overflow-x-auto">
        {QUESTION_BUTTONS.map(([label, type]) => (
          <button
            key={type}
            onClick={() => onQuestionSelect(type)}
            className={`
              px-3 py-1.5 text-xs rounded-sm whitespace-nowrap transition-all duration-200
              ${selectedQuestion === type
                ? 'bg-bronze-primary/15 text-bronze-glow border border-bronze-glow/30'
                : 'text-text-secondary border border-transparent hover:border-bronze-dim/20 hover:text-text-primary'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 解读内容 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 min-h-[300px]"
      >
        {!text && loading && (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary">
            <motion.div
              className="w-8 h-8 border border-bronze-primary/30 rounded-full mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ borderTopColor: 'rgba(212,168,83,0.8)' }}
            />
            <p className="text-sm">玄码正在推演...</p>
          </div>
        )}

        {text && (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
              {text.split('').map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.003, 0.5), duration: 0.1 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* 加载指示器 */}
            {loading && (
              <motion.span
                className="inline-block w-2 h-4 bg-bronze-primary/60 ml-0.5"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        )}

        {!text && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary/50">
            <p className="text-sm">选择一个解读方向开始</p>
          </div>
        )}
      </div>
    </div>
  );
}
