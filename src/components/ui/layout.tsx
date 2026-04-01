'use client';
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
        <Link href="/" className="relative flex items-center cursor-pointer selection:bg-transparent" title="윤지서점 홈으로 가기">
          {/* 누워있는 실제 전각 돌(도장 본체) CSS 그림 - 좌측 배치 및 진짜 돌덩어리 비율로 아담하게 단축 */}
          {/* 모바일에서는 좁아서 숨기고 PC에서만 보이도록 hidden md:flex 적용 */}
          <div className="relative hidden md:flex items-center mr-[6px] mt-1 opacity-95 z-0 transform translate-y-[2px]">
            
            {/* 그림자 (길이가 짧아진 깍두기 몸통 길이에 맞춰서 비율 더 축소) */}
            <div className="absolute top-[35px] md:top-[42px] left-[5px] w-[80px] md:w-[94px] h-[8px] md:h-[10px] bg-black/15 blur-[4px] rounded-[100%] origin-left transform -rotate-[1deg]"></div>
            
            {/* 1. 도장 몸통 (도장 자국 규격과 두꺼운 높이는 일치하게 두고, 길이는 깍둑썰기 한 돌멩이처럼 초압축) */}
            <div className="w-[80px] h-[40px] md:w-[94px] md:h-[48px] bg-gradient-to-r from-[#D7CDBB] via-[#E8DEC9] to-[#C9BAA3] rounded-[4px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_inset_0_-4px_6px_rgba(0,0,0,0.08)] transform rotate-[1.5deg] relative box-border border border-[#C5B7A1]">
              
              {/* 2. 도장 찍는 돌의 끝면(오른쪽)에 얕게 스며든 붉은 인주 자국 - 더 작고, 연하고, 돌 표면에 자연스럽게 번진 디테일 */}
              <div className="absolute top-[0] right-[0] w-[6px] md:w-[8px] h-full bg-gradient-to-r from-transparent to-[#A62B2B] rounded-r-[3px] opacity-50 mix-blend-multiply blur-[0.5px]"></div>
              <div className="absolute top-[0] right-[0] w-[1.5px] h-full bg-[#9B2A2A] rounded-r-[1px] opacity-75 mix-blend-multiply"></div>

              {/* 3. 돌 몸통의 파인 장식 홈 (조각 질감을 압축된 길이에 어울리게 조율) */}
              <div className="absolute right-[28px] top-0 w-[2px] h-full bg-black/10 shadow-[-1px_0_0_rgba(255,255,255,0.5)]"></div>
              <div className="absolute right-[33px] top-0 w-[1px] h-full bg-black/10 shadow-[-1px_0_0_rgba(255,255,255,0.4)]"></div>
              
            </div>
          </div>

          {/* 하이퍼 리얼리즘 수제 양각(주문) 스타일 마크 - 극찬을 받았던 명조체 버전 복구 + 수제 조각 느낌의 미세한 삐뚤어짐 디테일 추가 */}
          <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[48px] md:h-[48px] mt-1 relative z-20 transform -rotate-[3deg] bg-transparent border-[2.5px] border-[#A62B2B] mix-blend-multiply shadow-[0_2px_4px_rgba(166,43,43,0.15)]"
               style={{ borderRadius: '7px 3px 4px 6px' }}>
            {/* 이전의 불규칙한 투명도(opacity)를 복구하여 도장의 먹이 불균일하게 묻은 가장 예쁜 질감을 살려냄 */}
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-[2px] md:p-[3px] gap-0">
              {/* 기계적인 딱딱함을 지우고 "사람 손으로 비뚫게 파낸 듯한" 미세 각도(rotate) 조절을 새로운 디테일로 추가! */}
              <span className="flex items-end justify-end font-black text-[#A62B2B] text-[15px] md:text-[18px] leading-none opacity-90 pr-[1px] pb-[1px] transform -rotate-[2deg]" style={{ fontFamily: 'var(--font-logo), serif' }}>윤</span>
              <span className="flex items-end justify-start font-black text-[#A62B2B] text-[15px] md:text-[18px] leading-none opacity-[0.96] pl-[1px] pb-[1px] transform rotate-[1.5deg]" style={{ fontFamily: 'var(--font-logo), serif' }}>지</span>
              <span className="flex items-start justify-end font-black text-[#A62B2B] text-[15px] md:text-[18px] leading-none opacity-[0.98] pr-[1px] pt-[1px] transform rotate-[1deg]" style={{ fontFamily: 'var(--font-logo), serif' }}>서</span>
              <span className="flex items-start justify-start font-black text-[#A62B2B] text-[15px] md:text-[18px] leading-none opacity-85 pl-[1px] pt-[1px] transform -rotate-[3deg]" style={{ fontFamily: 'var(--font-logo), serif' }}>점</span>
            </div>
          </div>

        </Link>
        {rightContent}
      </div>
    </header>
  );
}

export function ContentContainer({ children }: { children: ReactNode }) {
  {/* 화면 전체 너비를 광활하게 사용하도록 레이아웃 제약 해제 (max-w-[2000px]) */}
  return <div className="w-full max-w-[2000px] mx-auto px-6 md:px-12 py-12 md:py-20">{children}</div>;
}
