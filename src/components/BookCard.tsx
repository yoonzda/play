'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Eraser, Trash2, X } from 'lucide-react';
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
          
          <div className="relative w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-[850px] h-[90vh] md:h-[85vh] flex flex-col bg-white shadow-[0_40px_100px_rgba(0,0,0,0.12)] rounded-[2px] overflow-hidden animate-in zoom-in-95 duration-500 ease-[cubic-bezier(0.2,1,0.2,1)]">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 flex items-center justify-center text-[#A89895] hover:text-[#111] transition-colors rounded-full z-50 bg-white/80 backdrop-blur-sm"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
            
            {/* 가름끈 (고전적인 패브릭 컷 북마크 디자인) - 제목을 가리지 않도록 좌측 끝 텅 빈 여백에 배치 (극단적이지 않게!) */}
            <div className="absolute top-0 left-4 sm:left-6 md:left-10 w-3.5 h-24 md:h-32 bg-[#A62B2B] shadow-md z-[60] origin-top transform"
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 8px), 0 100%)' }}>
            </div>

            {/* 1. 헤더 영역 (고정, Scrollbar 끝부분과 완벽히 일치하도록 풀 가로폭 border 적용) */}
            <div className="w-full shrink-0 px-8 sm:px-14 md:px-20 pt-16 md:pt-20 pb-6 z-10 bg-white border-b border-[#F0EBE1]">
              <div className="w-full max-w-[700px] mx-auto relative">
                <h1 className="font-heading text-[1.8rem] md:text-[2.2rem] tracking-tight font-bold text-[#111] leading-[1.3] break-keep pr-10">
                  {post.title}
                </h1>
              </div>
            </div>

            {/* 2. 스크롤 가능한 본문 영역 */}
            <div className="w-full flex-1 overflow-y-auto px-8 sm:px-14 md:px-20 py-8 custom-scrollbar">
              <div className="w-full max-w-[700px] mx-auto">
                <div className="text-[#2B2928] text-[15px] sm:text-[16px] leading-[1.8] tracking-[0.01em] font-body break-keep whitespace-pre-wrap">
                  {/* 단락 나누기를 위한 빈 줄(엔터) 입력 의도가 명확히 반영되도록 빈 줄을 h-6 간격으로 렌더링 */}
                  {post.content.split('\n').map((line, i) => (
                    line.trim() !== '' ? <p key={i} className="mb-1">{line}</p> : <div key={i} className="h-6"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. 하단 액션 영역 (사용자 요청으로 삭제됨, 오직 본문 콘텐츠 뷰어 역할에 집중) */}
            
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
