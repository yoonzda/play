import Link from 'next/link';
import { ReactNode } from 'react';

// === 윤지서점 : 전통 전각 및 도서관 테마 버튼 모듈 ===

// [도장 인주(Ink) 스며듦 효과 버튼]
// 서점의 차분한 분위기에 맞추어 아주 얇고 섬세한 테두리 사용.
// 마우스를 올리면 인주가 종이에 번지듯, 붉은색(#A62B2B)으로 테두리와 텍스트가 은은하게 물드는 이펙트.
const InkStampEffect = ({ text, isLoading = false }: { text: string; isLoading?: boolean }) => {
  return (
    // 여백(px-5)을 주어 글씨 크기가 커져도 여유롭고 자연스럽게 버튼 크기를 알아서 잡는 반응형 구조
    <div className="relative w-full h-full flex items-center justify-center px-4 md:px-5 border-[1px] border-[#D7CDBB] bg-[#FCF9F6] transition-all duration-500 ease-out group-hover:border-[#A62B2B] overflow-hidden">
      {/* 호버 시 바닥에서부터 아주 연한 인주색 바탕이 스며드는 디테일 (한지 느낌) */}
      <div className="absolute inset-0 bg-[#A62B2B] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"></div>
      
      {/* 텍스트 크기를 키워서 가독성을 올리고 도장의 굵직한 인장 느낌 강화 */}
      <span className={`relative z-10 font-black tracking-[0.1em] text-[14px] md:text-[15px] text-[#544234] transition-colors duration-500 group-hover:text-[#A62B2B] ${isLoading ? 'opacity-50' : ''}`} style={{ fontFamily: 'var(--font-logo), serif' }}>
         {isLoading ? '기록을 남기는 중...' : text}
      </span>

      {/* 버튼 모서리에 전각 도장의 투박하게 깎인 느낌을 주기 위한 미세한 가상 내부 테두리 장식 */}
      <div className="absolute top-[2px] left-[2px] right-[2px] bottom-[2px] border-[0.5px] border-transparent group-hover:border-[#A62B2B]/20 transition-all duration-700 pointer-events-none"></div>
    </div>
  );
};

// === 특별 이벤트 버튼 : 정제된 싱크 타이포그래피 밑줄 이펙트 (헤더 전용) ===
// 테두리와 배경을 모두 제거하고, 오직 "밑줄이 그어짐과 동시에 글씨가 왼쪽부터 오른쪽으로 붉게 물드는(스캔)" 극도의 미니멀리즘 마스크 효과만 남겼습니다.
// 추가로, 마우스를 뗄 때도 나타날 때와 동일하게 "왼쪽에서 오른쪽으로 사라지는(Continuous Wipe)" 기믹이 적용되어 있습니다.
const SpecialUnderlineEffect = ({ text, reverse = false }: { text: string; reverse?: boolean }) => {
  // 정방향(Forward): 왼쪽에서 오른쪽으로 나타나고, 왼쪽에서 오른쪽으로 사라짐
  // 역방향(Reverse): 오른쪽에서 왼쪽으로 나타나고, 오른쪽에서 왼쪽으로 사라짐
  const bgPositionClass = reverse 
    ? "bg-left group-hover:bg-right" 
    : "bg-right group-hover:bg-left";
    
  const originClass = reverse
    ? "origin-left group-hover:origin-right"
    : "origin-right group-hover:origin-left";

  // === 애니메이션 속도 모듈화 ===
  // 텍스트 물듦 속도와 밑줄이 그어지는 속도가 완전히 100% 동일해야 하므로 변수 하나로 제어
  // 기존 500ms(조금 묵직한 속도) -> 400ms(아주 조금 더 빠르고 경쾌한 속도)
  const SPEED_CLASS = "duration-[400ms]";

  return (
    <div className="relative inline-flex items-center justify-center bg-transparent px-2 py-1 cursor-pointer group">
      
      {/* 1. 기본 텍스트 */}
      <span className="font-bold tracking-[0.2em] text-[15px] md:text-[16px] text-[#544234]" style={{ fontFamily: 'var(--font-logo), serif' }}>
         {text}
      </span>
      
      {/* 2. 붉은색 스캔 텍스트 */}
      <span className={`absolute inset-0 flex items-center justify-center font-bold tracking-[0.2em] text-[15px] md:text-[16px] text-transparent bg-clip-text
                       bg-[linear-gradient(to_right,#A62B2B,#A62B2B)] bg-no-repeat bg-[length:0%_100%] group-hover:bg-[length:100%_100%]
                       transition-[background-size] ${SPEED_CLASS} ease-linear ${bgPositionClass}`} 
            style={{ fontFamily: 'var(--font-logo), serif' }}>
         {text}
      </span>

      {/* 3. 깔끔하고 정제된 얇은 붉은 밑줄 */}
      <div className={`absolute bottom-[2px] left-[5%] h-[1.5px] bg-[#A62B2B] w-[90%] 
                      scale-x-0 group-hover:scale-x-100 
                      transition-transform ${SPEED_CLASS} ease-linear ${originClass}`}></div>
      
    </div>
  );
};

// 1. 새 기록 쓰기 버튼 (텍스트 효과, 정방향 스윕)
export function WriteMemoButton({ href }: { href: string }) {
  return (
    <Link 
      href={href} 
      className="group relative inline-flex items-center justify-center overflow-visible"
    >
      <SpecialUnderlineEffect text="새로운 기록" />
    </Link>
  );
}

// 2. 돌아가기 / 다목적 서브 버튼 (텍스트 효과, 뒤로 돌아가는 느낌의 역방향 스윕!)
export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link 
      href={href} 
      className="group relative inline-flex items-center justify-center overflow-visible"
    >
      <SpecialUnderlineEffect 
        text={typeof children === 'string' ? children : '뒤로가기'} 
        reverse={true} 
      />
    </Link>
  );
}

// 3. 기록 저장 버튼 (글쓰기 완료 버튼, 약간 더 큼직하게)
export function PrimarySubmitButton({ loading, text }: { loading: boolean; text: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full h-[46px] md:h-[50px] disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(166,43,43,0.08)] transition-shadow duration-500 block rounded-[1px]"
    >
      <InkStampEffect text={text} isLoading={loading} />
    </button>
  );
}
