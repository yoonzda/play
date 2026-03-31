import Link from 'next/link';
import { ReactNode } from 'react';

export function PageRoot({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[#FCFAF8] text-[#2E2C2B] selection:bg-[#FCE4E1]">{children}</main>;
}

export function Header({ title, rightContent }: { title: string; rightContent?: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 bg-[#FCFAF8]/80 backdrop-blur-xl border-b border-[#F0EBE1]">
      {/* 2000px 꽉찬 너비 적용으로 마법의 도서관 느낌 극대화 */}
      <div className="flex justify-between items-center py-5 w-full max-w-[2000px] mx-auto px-6 md:px-12">
        <h1 className="font-heading text-[1.5rem] tracking-tight text-[#1A1817] font-bold">{title}</h1>
        {rightContent}
      </div>
    </header>
  );
}

export function ContentContainer({ children }: { children: ReactNode }) {
  {/* 화면 전체 너비를 광활하게 사용하도록 레이아웃 제약 해제 (max-w-[2000px]) */}
  return <div className="w-full max-w-[2000px] mx-auto px-6 md:px-12 py-12 md:py-20">{children}</div>;
}
