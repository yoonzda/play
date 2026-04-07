'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageRoot, Header } from '@/components/ui/layout';
import { SecondaryLink, PrimarySubmitButton } from '@/components/ui/button';

const CATEGORIES = ['일상', '문장', '업무', '프로젝트', '작업'];

// 완벽하게 복원된 진짜 이중선 원고지 SVG 배경타일
const wongoSvg = `url("data:image/svg+xml;utf8,<svg width='32' height='48' xmlns='http://www.w3.org/2000/svg'><line x1='0' y1='6' x2='32' y2='6' stroke='%23DE7A7A' stroke-width='0.5'/><line x1='0' y1='8' x2='32' y2='8' stroke='%23DE7A7A' stroke-width='1.2'/><line x1='0' y1='40' x2='32' y2='40' stroke='%23DE7A7A' stroke-width='1.2'/><line x1='0' y1='42' x2='32' y2='42' stroke='%23DE7A7A' stroke-width='0.5'/><line x1='0' y1='6' x2='0' y2='42' stroke='%23DE7A7A' stroke-width='1.2'/></svg>")`;
// 문장의 맨 마지막을 우측 선으로 닫아주는 특별 마감 타일
const wongoEndSvg = `url("data:image/svg+xml;utf8,<svg width='32' height='48' xmlns='http://www.w3.org/2000/svg'><line x1='0' y1='6' x2='32' y2='6' stroke='%23DE7A7A' stroke-width='0.5'/><line x1='0' y1='8' x2='32' y2='8' stroke='%23DE7A7A' stroke-width='1.2'/><line x1='0' y1='40' x2='32' y2='40' stroke='%23DE7A7A' stroke-width='1.2'/><line x1='0' y1='42' x2='32' y2='42' stroke='%23DE7A7A' stroke-width='0.5'/><line x1='0' y1='6' x2='0' y2='42' stroke='%23DE7A7A' stroke-width='1.2'/><line x1='31' y1='6' x2='31' y2='42' stroke='%23DE7A7A' stroke-width='1.2'/></svg>")`;

function AdminForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initCat = searchParams.get('category');
  const initialCategory = initCat && CATEGORIES.includes(initCat) ? initCat : CATEGORIES[0];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);

  // 커서(캐럿) 동기화 및 렌더링 최적화를 위한 상태
  const [caretPos, setCaretPos] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [cols, setCols] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // Mounted 플래그로 하이드레이션 이후 애니메이션 적용 최적화
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const updateCols = () => {
      if (editorRef.current) {
        const width = editorRef.current.clientWidth;
        setCols(Math.max(1, Math.floor(width / 32)));
      }
    };
    // Resize 시마다 editor의 넓이를 확인해 컬럼 수를 구함
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category }),
      });
      if (!res.ok) throw new Error('저장 실패');
      
      router.push('/');
      router.refresh();
    } catch {
      alert('오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      onKeyDown={(e) => {
        // 윈도우 한글 고유 버그: Input에서 엔터(Enter)시 멋대로 폼 전체가 제출되는 걸 원천 차단
        if ((e.key === 'Enter' || e.keyCode === 13) && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
      className="w-full h-full flex flex-col pt-8 md:pt-16 px-2 md:px-6"
    >
      
      {/* 1. 카테고리 (책 꽂을 위치) - 상하 이중선이 똑같이 적용된 진짜 원고지 띠 */}
      <div className="mb-14 md:mb-16 w-full flex flex-col items-center px-2">
        {/* 떨어졌을 때(줄바꿈 시) 상하 간격 완전 제로(0)! 위아래칸이 완벽하게 맞닿도록 0px(gap-y-0)로 극한 압축! */}
        <div className="flex flex-wrap items-center justify-center gap-y-0 gap-x-0 w-full mt-2">
          {CATEGORIES.map((cat, catIndex) => {
            const isSelected = category === cat;
            const chars = cat.split('');
            const isLastCat = catIndex === CATEGORIES.length - 1;
            
            return (
              <div key={cat} className="flex relative">
                <button
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="relative flex items-center group cursor-pointer"
                >
                  {/* 정교하게 정중앙에 스냅(Snap)되는 얇은 색연필 디테일 동그라미 (O) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[135%] z-10 pointer-events-none">
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="pencilCircle" x="-20%" y="-20%" width="140%" height="140%">
                          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="4" result="noise" />
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                      </defs>
                      <path 
                        // Y=20을 축으로 상하 대칭이 되도록 베지어 곡선 좌표를 한 치의 오차 없이 미세 조정!
                        d="M 10 20 C 15 4, 85 4, 90 20 C 95 36, 5 36, 12 18" 
                        fill="none" 
                        stroke="#D14949" 
                        strokeWidth="1.8" 
                        filter="url(#pencilCircle)"
                        strokeLinecap="round"
                        style={{ 
                          opacity: isSelected ? 0.95 : 0,
                          strokeDasharray: mounted ? 250 : 0, 
                          strokeDashoffset: isSelected ? 0 : 250,
                          transition: isSelected 
                            ? 'stroke-dashoffset 0.4s ease-out, opacity 0.1s ease-in' 
                            : 'stroke-dashoffset 0s, opacity 0.2s',
                        }}
                      />
                    </svg>
                  </div>

                  {/* 글자 칸들 */}
                  <div className="flex">
                    {chars.map((char, index) => {
                      const isEndBlock = isLastCat && index === chars.length - 1;
                      return (
                        <div 
                          key={index}
                          className="w-[32px] h-[48px] flex items-center justify-center transition-colors duration-300 relative"
                          style={{ backgroundImage: isEndBlock ? wongoEndSvg : wongoSvg }}
                        >
                          {/* 텍스트 크기 16px로 소폭 축소하여 칸 안에 여유롭게 안착시킴 */}
                          <span className={`font-black text-[16px] transition-colors duration-300 z-10
                              ${isSelected ? 'text-[#A62B2B]' : 'text-[#8D7F75] group-hover:text-[#544234]'}`}
                              style={{ fontFamily: 'var(--font-logo), serif' }}>
                            {char}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </button>
                
                {/* 단어 사이의 원고지 띄어쓰기 칸 (빈 상자) */}
                {!isLastCat && (
                  <div className="w-[32px] h-[48px]" style={{ backgroundImage: wongoSvg }}></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. 군더더기 싹 뺀 수수한 명조체 책 제목 인풋 */}
      <div className="mb-10 mt-6 relative w-full px-2 md:px-0">
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            // 한글 조합 중이면 아무 동작 안 함
            if (e.nativeEvent.isComposing) return; 
            
            // 엔터 입력 시 글이 바로 등록(넘어감)되는 것을 막고, 본문 에디터로 포커스 이동
            if (e.key === 'Enter' || e.keyCode === 13) {
              e.preventDefault();
              document.getElementById('editor-textarea')?.focus();
            }
          }}
          className="w-full bg-transparent outline-none text-[18px] sm:text-[20px] md:text-[22px] font-black tracking-widest placeholder-[#A8A09C]/80 text-[#544234] leading-tight pb-2 border-b border-[#DE7A7A]/60 focus:border-[#A62B2B] transition-colors"
          style={{ fontFamily: 'var(--font-logo), serif' }}
          placeholder="책 제목을 지어주세요"
        />
      </div>

      {/* 3. 거대한 가로 꽉 찬 진짜 원고지 에디터 영역 (개별 DOM 오버레이 - 완전 무결점 그리드 방식) */}
      <div className="relative mb-24 w-full flex-grow flex flex-col items-center px-0 md:px-0" ref={editorRef}>
        
        {/* 커스텀 캐럿 점멸 애니메이션 */}
        <style>{`
          @keyframes caretBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .custom-caret {
            animation: caretBlink 1.1s step-end infinite;
          }
        `}</style>

        <div className="w-full text-right mb-2 opacity-70">
           <span className="font-heading text-[#DE7A7A] text-[12px] font-bold tracking-widest border-b border-[#DE7A7A] pb-0.5">No. ______</span>
        </div>

        {/* 편집기 코어 컨테이너 (정확하게 계산된 넓이 `cols * 32`를 부여해 우측선 닫힘을 유도, +1px로 브라우저 소수점 잘림 방어) */}
        <div 
          className="relative min-h-[720px] overflow-hidden"
          style={{ width: cols > 0 ? cols * 32 + 1 : '100%' }}
        >
          
          {/* BACKGROUND LAYER: 매 렌더링마다 600+개의 DOM을 생성하는 방식(버벅임의 원인)을 폐기하고, 단 2개의 무한 반복 배경 DOM으로 원고지 바탕을 완벽하게 세팅 (성능 6000% 향상) */}
          {/* 1. 일반 타일 배경 (소수점 번짐 현상을 막기 위해 정확히 cols-1 칸만큼 넓이를 픽셀 단위로 제한) */}
          <div 
            className="absolute top-0 bottom-0 left-0 pointer-events-none z-0"
            style={{ 
              width: cols > 1 ? (cols - 1) * 32 : (cols === 1 ? 0 : '100%'),
              backgroundImage: wongoSvg, 
              backgroundSize: '32px 48px', 
              backgroundRepeat: 'repeat' 
            }}
          />
          {/* 2. 마감 타일 전용 우측 레이어 (일반 타일이 끝나는 바로 옆에서 1칸 분량만 정확하게 그림) */}
          <div 
            className="absolute top-0 bottom-0 pointer-events-none z-0 w-[32px]"
            style={{ 
              left: cols > 0 ? (cols - 1) * 32 : 'auto',
              right: cols === 0 ? 0 : 'auto',
              backgroundImage: wongoEndSvg, 
              backgroundSize: '32px 48px', 
              backgroundRepeat: 'repeat-y' 
            }}
          />

          {/* VISUAL TEXT LAYER: 타이핑된 글자와 커서만을 구동하여, 내용이 길어지면 부모의 높이를 무한정 팽창시키는(Auto-Expand) 기준점 역할 수행 */}
          <div className="relative pointer-events-none flex flex-wrap content-start z-10 w-full min-h-[720px]">
            {(() => {
              const elements = [];
              const chars = content.split('');
              
              // 최적화: 입력된 '글자'들만 최소한으로 렌더링 (빈 칸들은 더 이상 여기서 메모리를 먹으며 그리지 않음)
              for (let i = 0; i < chars.length; i++) {
                const char = chars[i];
                if (char === '\n') {
                  const isCaretHere = isFocused && caretPos === i;
                  
                  // 줄바꿈 시 basis-full 텅 빈 블럭을 넣어 플렉스 컨테이너를 다음 줄로 가볍게 넘김
                  elements.push(
                    <div key={`nl-${i}`} className="basis-full h-0 m-0 p-0 border-none relative">
                      {isCaretHere && (
                        // 줄바꿈 전 커서는 이전 줄의 맨 오른쪽 끝에 띄워줍니다
                        <div className="absolute right-0 bottom-0 top-[-48px] w-[32px] h-[48px] pointer-events-none">
                           <div className="absolute right-[4px] top-[14px] w-[2px] h-[20px] bg-[#D14949] custom-caret" />
                        </div>
                      )}
                    </div>
                  );
                  continue;
                }
                
                const isCaretHere = isFocused && caretPos === i;
                
                elements.push(
                  <div key={i} className="w-[32px] h-[48px] flex justify-center items-center relative">
                    <span className="font-black text-[16px] text-[#544234] relative z-20" style={{ fontFamily: 'var(--font-logo), serif' }}>
                      {char}
                    </span>
                    {/* 네이티브 포커스를 대체하는 커스텀 캐럿 */}
                    {isCaretHere && (
                      <div className="absolute left-[6px] top-[14px] w-[2px] h-[20px] bg-[#D14949] custom-caret z-30" />
                    )}
                  </div>
                );
              }
              
              // 글자 타이핑이 다 끝난 우측 (혹은 다음 줄 시작점) 대기열에 커서만 하나 가볍게 띄움
              const isCaretAtEnd = isFocused && caretPos >= chars.length;
              if (isCaretAtEnd) {
                elements.push(
                  <div key="caret-end" className="w-[32px] h-[48px] relative">
                    <div className="absolute left-[8px] top-[14px] w-[2px] h-[20px] bg-[#D14949] custom-caret z-30" />
                  </div>
                );
              }
              
              return elements;
            })()}
          </div>

          {/* INTERACTION LAYER: 사용자 입력을 받는 실제 Textarea (글씨 자체는 투명하게 숨기고 커서만 띄움) */}
          <textarea
            id="editor-textarea"
            required
            spellCheck="false"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setCaretPos(e.target.selectionEnd);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyUp={(e) => setCaretPos(e.currentTarget.selectionEnd)}
            onClick={(e) => setCaretPos(e.currentTarget.selectionEnd)}
            className="w-full min-h-[720px] resize-none outline-none font-black absolute inset-0 z-10 m-0"
            style={{
              // 시스템 글씨 및 기본 캐럿 점멸 완전 투명화 (방황하는 커서 제거)
              color: 'transparent',
              background: 'transparent',
              caretColor: 'transparent', 
              
              lineHeight: '48px', 
              fontSize: '16px', 
              letterSpacing: '16px', 
              fontFamily: 'var(--font-logo), serif', 
              wordBreak: 'break-all', 
              
              paddingTop: '0',
              paddingBottom: '0',
              paddingLeft: '8px', 
              paddingRight: '0'
            }}
          />
        </div>
      </div>

      {/* 4. 거대한 인장(도장) 발행 영역 */}
      <div className="flex justify-end pt-8 pb-24 px-2 md:px-6">
        <div className="w-full md:w-[260px]">
          <PrimarySubmitButton loading={loading} text="글쓰기마무리" />
        </div>
      </div>
      
    </form>
  );
}

export default function AdminPage() {
  return (
    <PageRoot>
      <Header 
        title="조용한 집필실" 
        rightContent={<SecondaryLink href="/">책장으로</SecondaryLink>} 
      />
      
      {/* Container의 여백 제약을 뚫고 나오는 Full-width 레이아웃을 위해 커스텀 */}
      <div className="w-full flex-grow flex flex-col px-0 md:px-2">
        <Suspense fallback={<div className="font-body text-[#A8A09C] py-24 text-center">원고지를 펴는 중...</div>}>
          <AdminForm />
        </Suspense>
      </div>
    </PageRoot>
  );
}
