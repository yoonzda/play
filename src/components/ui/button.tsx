import Link from 'next/link';
import { ReactNode } from 'react';

// === 특수 애니메이션 다이어리 버튼 모듈 ===

// [반갈죽 도어 오프닝] 사용자가 전혀 예상치 못한 아주 신박한(Novel) 기믹. 
// 평범한 버튼인 줄 알았는데, 호버 순간 버튼이 정확히 반으로 쪼개져 양옆으로 물리적으로 슬라이딩되며 숨겨진 다크레이어를 보여줍니다.
const SplitDoorEffect = ({ text, isLoading = false }: { text: string; isLoading?: boolean }) => {
  return (
    <>
      {/* 1. Underlying Base (열렸을 때 보여지는 하단 베이스 레이어) */}
      <div className="absolute inset-0 bg-[#544234] flex items-center justify-center z-0">
         <span className={`font-heading font-bold text-[15px] sm:text-[16px] text-[#FAFAF8] tracking-widest ${isLoading ? 'opacity-50' : ''}`}>
           {isLoading ? '저장 중...' : text}
         </span>
      </div>

      {/* 2. Left Door (윗 레이어 1/2 조각) */}
      <div className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#FDFBF7] border-[2px] border-r-0 border-[#544234] overflow-hidden z-10 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${!isLoading ? 'group-hover:-translate-x-[102%]' : ''}`}>
         {/* 내부 텍스트를 버튼 실사이즈(200%)로 맞춰 렌더링한 후 좌측 절반만 잘라냄(가면 효과) */}
         <div className="absolute top-0 bottom-0 left-0 w-[200%] flex items-center justify-center">
            <span className="font-heading font-bold text-[15px] sm:text-[16px] text-[#544234] tracking-widest">
              {isLoading ? '저장 중...' : text}
            </span>
         </div>
      </div>

      {/* 3. Right Door (윗 레이어 1/2 조각) */}
      <div className={`absolute top-0 bottom-0 right-0 w-1/2 bg-[#FDFBF7] border-[2px] border-l-0 border-[#544234] overflow-hidden z-10 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${!isLoading ? 'group-hover:translate-x-[102%]' : ''}`}>
         {/* 내부 텍스트를 버튼 실사이즈(200%)로 맞춰 렌더링한 후 우측 절반만 잘라냄 */}
         <div className="absolute top-0 bottom-0 right-0 w-[200%] flex items-center justify-center">
            <span className="font-heading font-bold text-[15px] sm:text-[16px] text-[#544234] tracking-widest">
              {isLoading ? '저장 중...' : text}
            </span>
         </div>
      </div>
    </>
  );
};

// 1. 새 기록 쓰기 버튼
export function WriteMemoButton({ href }: { href: string }) {
  return (
    <Link 
      href={href} 
      // 버튼 자체는 틀 역할만 함 (안의 도어들이 쪼개져나감)
      className="group relative inline-flex w-[160px] sm:w-[180px] h-[48px] sm:h-[52px] overflow-hidden rounded-[2px] shadow-[0_2px_5px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(84,66,52,0.15)] transition-shadow duration-500"
    >
      <SplitDoorEffect text="새 기록 쓰기" />
    </Link>
  );
}

// 2. 돌아가기 버튼 
const SECONDARY_BUTTON_STYLES = "font-heading inline-flex justify-center items-center px-5 py-3 bg-transparent text-[#978E89] text-[15px] rounded hover:bg-[#F3EFE9] hover:text-[#88807C] transition-colors duration-300";

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className={SECONDARY_BUTTON_STYLES}>{children}</Link>;
}

// 3. 기록 저장 버튼
export function PrimarySubmitButton({ loading, text }: { loading: boolean; text: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full h-[56px] overflow-hidden rounded-[2px] disabled:cursor-not-allowed shadow-[0_2px_5px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(84,66,52,0.15)] transition-shadow duration-500 block"
    >
      <SplitDoorEffect text={text} isLoading={loading} />
    </button>
  );
}
