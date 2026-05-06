import type { ChartData } from './qimen-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// DeepSeek direct config (for AI interpretation, bypassing tunnel)
const DEEPSEEK_API_KEY = 'sk-ce194c8aa5794610ac2e5a00fbfee37e';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

// ── Chart calculation (through backend tunnel) ──

export async function calculateChart(datetime: string): Promise<ChartData> {
  const res = await fetch(`${API_BASE}/api/chart/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ datetime, school: 'zhuanpan' }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.chart;
}

export async function getCurrentChart(): Promise<ChartData> {
  const res = await fetch(`${API_BASE}/api/chart/current`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.chart;
}

// ── AI Interpretation (direct DeepSeek, bypassing tunnel) ──

const SYSTEM_PROMPT = `你是一位精通奇门遁甲的大师，名叫「玄码」。你的解读风格：
1. 先概述盘面基本信息（阴阳遁、局数、节气、四柱）
2. 定位用神（根据用户问的事情，找到盘面对应的宫位）
3. 分析用神宫位的星、门、神、奇仪组合
4. 给出吉凶判断和行动建议
5. 用词专业但不晦涩，让爱好者能理解

每个宫位包含：
- 地盘天干（奇仪）
- 天盘天干
- 九星（天蓬/天芮/天冲/天辅/天禽/天心/天柱/天任/天英）
- 八门（休/死/伤/杜/开/惊/生/景）
- 八神（值符/螣蛇/太阴/六合/白虎/玄武/九地/九天）

请在解读中引用具体的星门神组合，不要泛泛而谈。`;

const QUESTION_PROMPTS: Record<string, string> = {
  general: '请对这个奇门遁甲盘面做一个全面的解读，包括整体趋势、关键格局、以及各个方面的吉凶提示。',
  career: '请从事业/工作的角度解读这个盘面，重点分析：升迁机会、项目进展、合作关系、以及需要注意的风险。',
  relationship: '请从感情/人际关系的角度解读这个盘面，分析桃花运、伴侣关系、人际交往的吉凶方向。',
  health: '请从健康角度解读这个盘面，分析身体状况趋势、需要注意的方面、以及养生建议。',
  wealth: '请从财运角度解读这个盘面，分析正财偏财、投资方向、以及需要注意的破财信号。',
};

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export async function interpretDeepSeek(
  chartData: ChartData | null,
  questionType: string,
  callbacks: StreamCallbacks,
  customQuestion?: string,
  apiKey?: string
): Promise<void> {
  const key = apiKey || DEEPSEEK_API_KEY;
  const question = customQuestion || QUESTION_PROMPTS[questionType] || QUESTION_PROMPTS.general;

  const userMessage = chartData ? JSON.stringify(chartData, null, 2) : '当前时刻起盘数据';
  const userPrompt = `以下是一个奇门遁甲盘面的完整数据：\n\n\`\`\`json\n${userMessage}\n\`\`\`\n\n${question}`;

  try {
    const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      callbacks.onError(`DeepSeek API 错误 (${res.status}): ${errText.slice(0, 200)}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      callbacks.onError('无法读取响应流');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            callbacks.onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed?.choices?.[0]?.delta?.content;
            if (content) callbacks.onToken(content);
          } catch {
            // skip
          }
        }
      }
    }
    callbacks.onDone();
  } catch (e) {
    callbacks.onError(e instanceof Error ? e.message : '网络错误');
  }
}
