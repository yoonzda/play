'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageRoot, Header } from '@/components/ui/layout';
import { SecondaryLink, PrimarySubmitButton } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';

const CATEGORIES = ['일상', '문장', '업무', '프로젝트', '작업'];

const getWongoSvg = (stroke: string) => `url("data:image/svg+xml;utf8,<svg width='32' height='48' xmlns='http://www.w3.org/2000/svg'><line x1='0' y1='6' x2='32' y2='6' stroke='${stroke}' stroke-width='0.5'/><line x1='0' y1='8' x2='32' y2='8' stroke='${stroke}' stroke-width='1.2'/><line x1='0' y1='40' x2='32' y2='40' stroke='${stroke}' stroke-width='1.2'/><line x1='0' y1='42' x2='32' y2='42' stroke='${stroke}' stroke-width='0.5'/><line x1='0' y1='6' x2='0' y2='42' stroke='${stroke}' stroke-width='1.2'/></svg>")`;
const getWongoEndSvg = (stroke: string) => `url("data:image/svg+xml;utf8,<svg width='32' height='48' xmlns='http://www.w3.org/2000/svg'><line x1='0' y1='6' x2='32' y2='6' stroke='${stroke}' stroke-width='0.5'/><line x1='0' y1='8' x2='32' y2='8' stroke='${stroke}' stroke-width='1.2'/><line x1='0' y1='40' x2='32' y2='40' stroke='${stroke}' stroke-width='1.2'/><line x1='0' y1='42' x2='32' y2='42' stroke='${stroke}' stroke-width='0.5'/><line x1='0' y1='6' x2='0' y2='42' stroke='${stroke}' stroke-width='1.2'/><line x1='31' y1='6' x2='31' y2='42' stroke='${stroke}' stroke-width='1.2'/></svg>")`;

// 테마 색상 (Red 와 Sage Green 교대)
export const THEMES = [
  { strokeUrl: '%23DE7A7A', strokeHex: '#DE7A7A', caret: '#D14949', hoverHover: '#C23C3C' }, 
  { strokeUrl: '%237B9D8B', strokeHex: '#7B9D8B', caret: '#618270', hoverHover: '#537060' }, 
];
const wongoSvg = getWongoSvg(THEMES[0].strokeUrl); // 기존 기본(카테고리뷰)은 Red 유지
const wongoEndSvg = getWongoEndSvg(THEMES[0].strokeUrl);

// 개별 원고지 에디터 컴포넌트 (상태 격리)
function WongojiEditor({
  index,
  content,
  onChange,
}: {
  index: number;
  content: string;
  onChange: (val: string) => void;
}) {
  const [caretPos, setCaretPos] = useState(content.length);
  const [isFocused, setIsFocused] = useState(false);
  const [cols, setCols] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // 페이지(index)가 변경될 때 캐럿을 항상 글 끝머리로 리셋
  useEffect(() => {
    setCaretPos(content.length);
  }, [index]);

  useEffect(() => {
    const updateCols = () => {
      if (editorRef.current) {
        const width = editorRef.current.clientWidth;
        setCols(Math.max(1, Math.floor(width / 32)));
      }
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const theme = THEMES[0];
  const bgSvg = getWongoSvg(theme.strokeUrl);
  const bgEndSvg = getWongoEndSvg(theme.strokeUrl);

  return (
    <div className="relative mb-16 w-full flex-grow flex flex-col items-center px-0 md:px-0" ref={editorRef}>
      <style>{`
        @keyframes caretBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .custom-caret-${index} {
          animation: caretBlink 1.1s step-end infinite;
          background-color: ${theme.caret};
        }
      `}</style>

      <div 
        className="relative min-h-[720px] overflow-hidden"
        style={{ width: cols > 0 ? cols * 32 + 1 : '100%' }}
      >
        <div 
          className="absolute top-0 bottom-0 left-0 pointer-events-none z-0"
          style={{ 
            width: cols > 1 ? (cols - 1) * 32 : (cols === 1 ? 0 : '100%'),
            backgroundImage: bgSvg, 
            backgroundSize: '32px 48px', 
            backgroundRepeat: 'repeat' 
          }}
        />
        <div 
          className="absolute top-0 bottom-0 pointer-events-none z-0 w-[32px]"
          style={{ 
            left: cols > 0 ? (cols - 1) * 32 : 'auto',
            right: cols === 0 ? 0 : 'auto',
            backgroundImage: bgEndSvg, 
            backgroundSize: '32px 48px', 
            backgroundRepeat: 'repeat-y' 
          }}
        />

        <div className="relative pointer-events-none flex flex-wrap content-start z-10 w-full min-h-[720px]">
          {(() => {
            const elements = [];
            const chars = content.split('');
            for (let i = 0; i < chars.length; i++) {
              const char = chars[i];
              const isCaretHere = isFocused && caretPos === i;
              
              if (char === '\n') {
                elements.push(
                  <div key={`nl-${i}`} className="basis-full h-0 m-0 p-0 border-none relative">
                    {isCaretHere && (
                      <div className="absolute right-0 bottom-0 top-[-48px] w-[32px] h-[48px] pointer-events-none">
                         <div className={`absolute right-[4px] top-[14px] w-[2px] h-[20px] custom-caret-${index}`} />
                      </div>
                    )}
                  </div>
                );
                continue;
              }
              
              elements.push(
                <div key={i} className="w-[32px] h-[48px] flex justify-center items-center relative">
                  <span className="font-black text-[16px] text-[#544234] relative z-20" style={{ fontFamily: 'var(--font-logo), serif' }}>
                    {char}
                  </span>
                  {isCaretHere && (
                    <div className={`absolute left-[6px] top-[14px] w-[2px] h-[20px] custom-caret-${index} z-30`} />
                  )}
                </div>
              );
            }
            
            const isCaretAtEnd = isFocused && caretPos >= chars.length;
            if (isCaretAtEnd) {
              elements.push(
                <div key="caret-end" className="w-[32px] h-[48px] relative">
                  <div className={`absolute left-[8px] top-[14px] w-[2px] h-[20px] custom-caret-${index} z-30`} />
                </div>
              );
            }
            
            return elements;
          })()}
        </div>

        <textarea
          required
          spellCheck="false"
          value={content}
          onChange={(e) => {
            onChange(e.target.value);
            setCaretPos(e.target.selectionEnd);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyUp={(e) => setCaretPos(e.currentTarget.selectionEnd)}
          onClick={(e) => setCaretPos(e.currentTarget.selectionEnd)}
          className="w-full min-h-[720px] resize-none outline-none font-black absolute inset-0 z-10 m-0"
          style={{
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
  );
}

function AdminForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initCat = searchParams.get('category');
  const initialCategory = initCat && CATEGORIES.includes(initCat) ? initCat : CATEGORIES[0];
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState<string[]>(['']);
  const [activeIdx, setActiveIdx] = useState(0);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (editId) {
      fetch(`/api/posts/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setTitle(data.title || '');
            setCategory(data.category || CATEGORIES[0]);
            if (data.content) {
              const parts = data.content.split('[====PAGE_BREAK====]');
              setContents(parts.length > 0 ? parts : ['']);
            }
          }
        })
        .catch(console.error);
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalContent = contents.join('[====PAGE_BREAK====]');
    const url = editId ? `/api/posts/${editId}` : '/api/posts';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: finalContent, category }),
      });
      if (!res.ok) throw new Error('저장 실패');
      
      router.push('/');
      router.refresh();
    } catch {
      alert('오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleUpdateContent = (index: number, val: string) => {
    const newContents = [...contents];
    newContents[index] = val;
    setContents(newContents);
  };

  const handleAddPage = () => {
    setContents([...contents, '']);
  };

  const handleRemovePage = (index: number) => {
    if (contents.length > 1) {
      setContents(contents.filter((_, i) => i !== index));
      if (activeIdx >= index && activeIdx > 0) {
        setActiveIdx(activeIdx - 1);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.keyCode === 13) && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
      className="w-full h-full flex flex-col pt-8 md:pt-16 px-2 md:px-6"
    >
      <div className="mb-14 md:mb-16 w-full flex flex-col items-center px-2">
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
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[135%] z-10 pointer-events-none">
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="pencilCircle" x="-20%" y="-20%" width="140%" height="140%">
                          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="4" result="noise" />
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                      </defs>
                      <path 
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

                  <div className="flex">
                    {chars.map((char, index) => {
                      const isEndBlock = isLastCat && index === chars.length - 1;
                      return (
                        <div 
                          key={index}
                          className="w-[32px] h-[48px] flex items-center justify-center transition-colors duration-300 relative"
                          style={{ backgroundImage: isEndBlock ? wongoEndSvg : wongoSvg }}
                        >
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
                
                {!isLastCat && (
                  <div className="w-[32px] h-[48px]" style={{ backgroundImage: wongoSvg }}></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. 제목 인풋 (가장 위쪽) */}
      <div className="mb-6 mt-4 relative w-full px-2 md:px-0">
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return; 
            if (e.key === 'Enter' || e.keyCode === 13) {
              e.preventDefault();
            }
          }}
          className="w-full bg-transparent outline-none text-[18px] sm:text-[20px] md:text-[22px] font-black tracking-widest placeholder-[#A8A09C]/80 text-[#544234] leading-tight pb-2 border-b border-[#DE7A7A]/60 focus:border-[#A62B2B] transition-colors"
          style={{ fontFamily: 'var(--font-logo), serif' }}
          placeholder="책 제목을 지어주세요"
        />
      </div>

      {/* 2. 페이지 네비게이션 & No. 표시 (심플 타이포 및 개별 라인) */}
      <div className="w-full mb-3 flex items-start justify-between px-2 md:px-0">
        
        {/* 좌측: 네비게이션 탭 (길어져도 줄바꿈 되며 가려지지 않음) */}
        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 flex-grow mr-4">
          
          {/* 새 장 추가 (+) - 심플한 테두리 형태 */}
          <button
            type="button"
            onClick={() => { handleAddPage(); setActiveIdx(contents.length); }}
            className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full border border-dashed border-[#DE7A7A] text-[#D14949] hover:bg-[#DE7A7A]/10 opacity-80 hover:opacity-100"
            title="페이지 추가"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>

          {/* 페이지 숫자 번호들 */}
          {contents.length > 1 && contents.map((_, i) => (
            <div key={i} className="flex relative group items-center">
              <button
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`flex items-center justify-center w-10 h-8 font-black text-[15px] tracking-widest relative
                  ${activeIdx === i 
                    ? 'text-[#544234]' 
                    : 'text-[#C9C2BA] hover:text-[#8D7F75] bg-transparent'}`}
                style={{ fontFamily: 'var(--font-logo), serif' }}
              >
                {String(i + 1).padStart(2, '0')}
                {/* 액티브 탭 아래에 밑줄 (라인 하나) */}
                {activeIdx === i && (
                  <div className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#D14949]" />
                )}
              </button>
              {/* 삭제 버튼 - 엑티브 상태일 때만 숫자 우측 곁에 넉넉한 크기로 배치 */}
              {activeIdx === i && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemovePage(i); }} 
                  className="absolute top-1/2 -translate-y-1/2 -right-5 w-6 h-6 rounded-full flex items-center justify-center text-[#DE7A7A] hover:bg-[#DE7A7A]/10 hover:text-[#C23C3C] transition-colors"
                  title="페이지 삭제"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 우측: No. 표시 (길어져도 우측에 안정적으로 고정) */}
        <div className="shrink-0 opacity-70 pt-1.5">
          <span className="font-heading text-[14px] font-bold tracking-widest pb-0.5 border-b-2 text-[#DE7A7A] border-[#DE7A7A]">
            No. {String(activeIdx + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="w-full flex-grow flex flex-col items-center">
        {/* 현재 선택된(active) 원고지만 렌더링 (리마운트 번쩍임 방지를 위해 key 제거) */}
        <WongojiEditor
          index={activeIdx}
          content={contents[activeIdx] || ''}
          onChange={(val) => handleUpdateContent(activeIdx, val)}
        />
      </div>

      <div className="flex justify-end pt-8 pb-24 px-2 md:px-6">
        <div className="w-full md:w-[260px]">
          <PrimarySubmitButton loading={loading} text={editId ? "수정완료" : "글쓰기마무리"} />
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
      <div className="w-full flex-grow flex flex-col px-0 md:px-2">
        <Suspense fallback={<div className="font-body text-[#A8A09C] py-24 text-center">원고지를 펴는 중...</div>}>
          <AdminForm />
        </Suspense>
      </div>
    </PageRoot>
  );
}
