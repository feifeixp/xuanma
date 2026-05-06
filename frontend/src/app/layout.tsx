import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: '玄码 XuanMa — 奇门遁甲',
  description: 'AI 驱动的奇门遁甲排盘与解读平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&family=Noto+Sans+SC:wght@300;400;500;700&family=Space+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-cosmic-deep text-text-primary font-body antialiased">
        {/* 星空背景 */}
        <div className="cosmic-stars" />
        
        {/* 顶部导航 */}
        <nav className="relative z-10 border-b border-bronze-dim/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-display text-2xl text-bronze-primary tracking-wider">
              玄码
            </a>
            <div className="flex gap-6 text-sm text-text-secondary">
              <a href="/chart" className="hover:text-bronze-glow transition-colors">起盘</a>
              <a href="/interpret" className="hover:text-bronze-glow transition-colors">解盘</a>
              <a href="/cases" className="hover:text-bronze-glow transition-colors">案例</a>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
