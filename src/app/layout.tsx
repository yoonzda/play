import type { Metadata } from 'next';
import { Gowun_Dodum, Nanum_Myeongjo } from 'next/font/google';
import './globals.css';

// 1번 폰트 모듈: 단정하고 감성적인 다이어리 느낌의 '고운 돋움(Sans)' 폰트로 변경 (가독성 향상)
const gowunDodum = Gowun_Dodum({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

// 고급스럽고 우아한 명조체 로고 폰트 추가
const nanumMyeongjo = Nanum_Myeongjo({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-logo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '윤지서점',
  description: '새로운 생각과 지식을 기록하는 서점',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${gowunDodum.variable} ${nanumMyeongjo.variable}`}>
      <body className="antialiased font-body">
        {children}
      </body>
    </html>
  );
}
