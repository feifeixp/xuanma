import type { ChartData } from './qimen-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

export function interpretStream(
  chartData: ChartData | null,
  questionType: string,
  customQuestion?: string,
  apiKey?: string
): EventSource {
  // We use fetch + ReadableStream for SSE since EventSource doesn't support POST
  // Return a fetch-based wrapper instead
  const controller = new AbortController();
  const body: Record<string, unknown> = {
    question_type: questionType,
  };
  if (chartData) body.chart_data = chartData;
  if (customQuestion) body.custom_question = customQuestion;
  if (apiKey) body.api_key = apiKey;

  // We'll use event-source-polyfill approach — return the fetch response
  // Caller should use .text() stream reading
  throw new Error(
    'Use interpretStreamFetch() for POST-based SSE — EventSource does not support POST'
  );
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export async function interpretStreamFetch(
  chartData: ChartData | null,
  questionType: string,
  callbacks: StreamCallbacks,
  customQuestion?: string,
  apiKey?: string
): Promise<void> {
  const body: Record<string, unknown> = {
    question_type: questionType,
  };
  if (chartData) body.chart_data = chartData;
  if (customQuestion) body.custom_question = customQuestion;
  if (apiKey) body.api_key = apiKey;

  const res = await fetch(`${API_BASE}/api/ai/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    callbacks.onError(`API error: ${res.status}`);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    callbacks.onError('No response stream');
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
          if (parsed.error) {
            callbacks.onError(parsed.error);
            return;
          }
          if (parsed.content) {
            callbacks.onToken(parsed.content);
          }
        } catch {
          // skip unparseable lines
        }
      }
    }
  }
  callbacks.onDone();
}
