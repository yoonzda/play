'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Eraser, Trash2, X, ChevronRight, ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react';
type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
};

// 모던 화이트 갤러리 감성을 살린 미니멀 화이트/아이보리/그레이 톤 통합 팔레트
// 색상을 하얀 톤으로 통일해 가장 책장답고 깔끔한 갤러리를 만듭니다.
const PALETTES: Record<string, { bg: string; text: string }[]> = {
  // [일상] 퓨어 화이트 & 웜 아이보리
  '일상': [
    { bg: 'bg-[#FFFFFF]', text: 'text-[#2E2C2B]' }, 
    { bg: 'bg-[#FAFAFA]', text: 'text-[#2E2C2B]' }, 
  ],
  // [문장] 따뜻한 크림 & 라이트 베이지
  '문장': [
    { bg: 'bg-[#FDF9F1]', text: 'text-[#3B3431]' }, 
    { bg: 'bg-[#FCF5E8]', text: 'text-[#3B3431]' }, 
  ],
  // [업무] 맑은 라이트 펄 그레이
  '업무': [
    { bg: 'bg-[#F4F4F4]', text: 'text-[#33383B]' }, 
    { bg: 'bg-[#EEEEEE]', text: 'text-[#2C3134]' }, 
  ],
  // [프로젝트] 페일 아몬드 화이트 (미세하게 따뜻한 회색)
  '프로젝트': [
    { bg: 'bg-[#F2ECE4]', text: 'text-[#363025]' }, 
    { bg: 'bg-[#EAE3DA]', text: 'text-[#363025]' }, 
  ],
  // [작업] 매트한 본 화이트 (Bone White)
  '작업': [
    { bg: 'bg-[#EBE9E4]', text: 'text-[#222222]' }, 
    { bg: 'bg-[#E4E2DD]', text: 'text-[#222222]' }, 
  ],
};

export function BookCard({ post, variant = 'spine' }: { post: Post, variant?: 'spine' | 'list' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // 작성자가 명시적으로 나눈 페이지 단위로 배열화
  const pages = (post.content || '').split('[====PAGE_BREAK====]');
  // 만약 윈도우 사이즈 변경 등 예기치 않은 오류 방지용 안전 장치
  const safePage = Math.min(currentPage, Math.max(0, pages.length - 1));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('소중한 기록을 도서관에서 영구적으로 비웁니다. 괜찮으신가요?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
      setIsOpen(false);
      router.refresh();
    } catch {
      alert('오류가 발생했습니다.');
      setIsDeleting(false);
    }
  };

  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
    return Math.abs(hash);
  };
  
  const randomFactor = getHash(post.title + post.id);

  const palette = PALETTES[post.category] || PALETTES['작업'];
  const theme = palette[randomFactor % palette.length];

  const assignedHeight = 'h-[240px]';

  const maxChars = 9;
  const displayTitle = post.title.length > maxChars 
    ? post.title.substring(0, maxChars) + '..' 
    : post.title;

  return (
    <>
      {variant === 'spine' ? (
        <button 
          onClick={() => setIsOpen(true)}
          title={post.title}
          className={`group relative flex flex-col justify-end w-[46px] sm:w-[50px] ${assignedHeight} ${theme.bg} rounded-[2px] 
            transition-transform duration-[400ms] ease-out shrink-0 z-10 hover:z-50 
            hover:-translate-y-5 hover:brightness-105 border border-[#E0DCD6]
            shadow-[inset_3px_0_6px_rgba(255,255,255,0.6),inset_-3px_0_6px_rgba(0,0,0,0.03),4px_0_10px_rgba(0,0,0,0.06)]`}
          style={{ willChange: 'transform' }}
        >

          {/* 화이트 갤러리 톤다운 방지 및 입체감 미세선 */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-white rounded-t-[2px] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.03)]"></div>
          <div className="absolute top-5 left-0 right-0 h-[1.5px] bg-black/5 shadow-[0_4px_0_rgba(255,255,255,0.5)]"></div>
          
          <div className="flex-1 w-full flex items-center justify-center mt-6 mb-8 px-[2px]">
            <div 
              className={`font-heading text-[13px] sm:text-[14px] font-bold ${theme.text} tracking-wider opacity-90`}
              style={{ writingMode: 'vertical-rl' }}
            >
              {displayTitle}
            </div>
          </div>
          
          <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-85">
             {/* 허여멀건함을 잡아주기 위해 도장과 어울리는 붉은색 타이포그래피 포인트 (과하지 않음) */}
             <span className={`text-[9px] font-bold text-[#C23C3C] uppercase tracking-widest`}>
               {new Date(post.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
             </span>
          </div>
        </button>
      ) : (
        <div onClick={() => setIsOpen(true)} className="w-full flex justify-between items-center py-4 sm:py-5 border-b border-[#EAE5DF] hover:bg-white cursor-pointer px-2 sm:px-4 transition-colors">
          <div className="relative flex-1 flex flex-col items-start gap-1">
            <span className="font-bold text-[#111] text-[15px] sm:text-[17px] tracking-wide leading-snug whitespace-normal break-words break-keep w-full pr-2">{post.title || '무제'}</span>
            <span className="text-[#A89895] text-[12px] sm:text-[13px] tracking-widest font-mono uppercase mt-1">
              {new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*$/, '').replace(/\./g, '/').replace(/ /g, '')}
            </span>
          </div>
        </div>
      )}

      {/* 내부 팝업 (미니멀 갤러리 폼) */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#2B2928]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[70vw] max-w-[1100px] h-[85vh] flex flex-col">
            
            {/* 통합 액션 버튼 (모바일: 종이 바깥 위쪽에 나열되어 종이 높이를 양보받음 / 데스크탑: 종이 바깥 우측 허공에 매달림) */}
            <div className="w-full sm:w-auto flex flex-row justify-end sm:flex-col gap-2 sm:gap-4 z-50 mb-3 sm:mb-0 relative sm:absolute sm:top-6 sm:-right-[65px] animate-in fade-in zoom-in duration-500 delay-300">
              {/* 닫기 버튼 */}
              <button 
                onClick={() => setIsOpen(false)}
                title="닫기"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white text-white/85 hover:text-[#111] rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md sm:shadow-lg hover:shadow-xl border border-white/20 group cursor-pointer"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </button>
              
              {/* 수정 버튼 */}
              <button 
                onClick={() => router.push(`/admin?edit=${post.id}`)}
                title="수정"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white text-white/85 hover:text-[#555] rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md sm:shadow-lg hover:shadow-xl border border-white/20 group cursor-pointer"
              >
                <Eraser className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] group-hover:scale-110 transition-transform" />
              </button>

              {/* 삭제 버튼 */}
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                title="삭제"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-[#FFF5F5] text-white/85 hover:text-[#C23C3C] rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md sm:shadow-lg hover:shadow-xl border border-white/20 disabled:opacity-50 group cursor-pointer"
              >
                <Trash2 className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* 실제 하얀 종이 (본문 영역) */}
            <div className="relative flex-1 flex flex-col bg-white shadow-[0_40px_100px_rgba(0,0,0,0.12)] rounded-[2px] overflow-hidden animate-in zoom-in-95 duration-500 ease-[cubic-bezier(0.2,1,0.2,1)]">

              {/* 1. 헤더 영역 (고정) */}
              <div className="w-full shrink-0 pt-6 sm:pt-8 md:pt-10 z-10 bg-[#FCFBFA] relative">
                {/* 헤더 밑줄이 본문의 노트줄과 길이가 일치하도록 전체 영역(w-full)에서 border-collapse */}
                <div className="w-full relative z-10 border-b border-[#E0DCD6] pb-4">
                  <div className="w-full max-w-[1000px] mx-auto px-6 sm:px-10 md:px-14">
                    <h1 className="pr-16 md:pr-20 font-heading text-[1.6rem] sm:text-[1.8rem] md:text-[2.2rem] tracking-tight font-bold text-[#111] leading-[1.3] break-keep">
                      {post.title}
                    </h1>
                  </div>
                </div>
              </div>

              {/* 2. 스크롤 래퍼 (배경선과 텍스트가 무조건 함께 스크롤되어 글자 엇갈림 절대 방지) */}
              <div 
                ref={scrollRef}
                className="w-full flex-1 overflow-y-auto custom-scrollbar relative bg-[#FCFBFA]"
                style={{
                  lineHeight: '34px',
                  backgroundImage: 'linear-gradient(to bottom, transparent 0px, transparent 33px, #EAE5DD 33px, #EAE5DD 34px)',
                  backgroundSize: '100% 34px',
                  WebkitBackgroundSize: '100% 34px',
                  backgroundAttachment: 'local',
                }}
              >
                <div 
                  key={safePage} // 페이지가 바뀔 때마다 페이드인 애니메이션 재구동
                  className="w-full max-w-[1000px] mx-auto px-6 sm:px-10 md:px-14 pb-[136px] animate-in fade-in duration-500"
                >
                  {/* 텍스트 본문 */}
                  <div className="text-[#2B2928] text-[15px] sm:text-[16px] md:text-[17px] tracking-[0.01em] font-body break-keep whitespace-pre-wrap pt-[34px]">
                    {pages[safePage]}
                  </div>
                </div>

                {/* 단일 페이지인 경우 시각적인 들림 데코레이션 표시 (스크롤 안에서 맨 마지막에 위치) */}
                {pages.length <= 1 && (
                  <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-tl from-[#Eae5dd]/50 to-transparent shadow-[-2px_-2px_10px_rgba(0,0,0,0.02)] rounded-tl-3xl pointer-events-none z-10" />
                )}
              </div>

              {/* 3. 명시적 페이지 넘김 오버레이 (스크롤 영역 '밖'에서 절대 고정. 언제나 화면 최하단에 붙어있음!) */}
              {pages.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-[68px] z-30 pointer-events-none flex items-end justify-center">
                  {/* 흐림 효과를 통해 스크롤되어 지나가는 배경선과 텍스트를 자연스럽게 덮음 (절단선 없는 통일감) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FCFBFA] via-[#FCFBFA]/80 to-transparent pointer-events-none" />
                  
                  <div className="w-full max-w-[1000px] px-6 sm:px-10 md:px-14 pb-[17px] flex justify-between pointer-events-auto relative z-10 text-[#888]">
                    {/* 이전 페이지 화살표 */}
                    <button 
                      onClick={() => {
                        if (safePage === 0) return;
                        setCurrentPage(safePage - 1);
                        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`flex items-center transition-colors bg-white/50 backdrop-blur-md rounded-full p-2 shadow-sm ${safePage > 0 ? 'hover:text-[#D14949] cursor-pointer' : 'text-[#E0DCD6] cursor-default opacity-50'}`}
                      title={safePage > 0 ? "이전 장" : ""}
                    >
                      <ArrowLeft size={24} strokeWidth={2} />
                    </button>

                    {/* 다음 페이지 화살표 */}
                    <button 
                      onClick={() => {
                        if (safePage === pages.length - 1) return;
                        setCurrentPage(safePage + 1);
                        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`flex items-center transition-colors bg-white/50 backdrop-blur-md rounded-full p-2 shadow-sm ${safePage < pages.length - 1 ? 'hover:text-[#D14949] cursor-pointer' : 'text-[#E0DCD6] cursor-default opacity-50'}`}
                      title={safePage < pages.length - 1 ? "다음 장" : ""}
                    >
                      <ArrowRight size={24} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
