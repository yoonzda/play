'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
};

// [업데이트] 고객 니즈 반영: 촌스러운 알록달록함을 빼고, 다시 카테고리 본래의 고급스럽고 탁한 톤(Tone-on-tone)으로 묶되, 식별은 되게끔 미세한 명도차 추가
const PALETTES: Record<string, { bg: string; text: string }[]> = {
  // [일상] 포근한 라떼 베이지 계열 (미세한 핑크빛, 아몬드빛 변주)
  '일상': [
    { bg: 'bg-[#CFAFA8]', text: 'text-[#4A322C]' }, 
    { bg: 'bg-[#C9A687]', text: 'text-[#FCF6F0]' }, 
    { bg: 'bg-[#A89885]', text: 'text-[#FCEFE3]' }, 
    { bg: 'bg-[#B09983]', text: 'text-[#F5EFEA]' }, 
    { bg: 'bg-[#DEB895]', text: 'text-[#6A5A4A]' }, 
  ],
  // [영감] 활기찬 톤다운 브릭 오렌지 (미세한 살구빛 웜오렌지 변주)
  '영감': [
    { bg: 'bg-[#CA6E5A]', text: 'text-[#FDF2F0]' }, 
    { bg: 'bg-[#E38F6B]', text: 'text-[#FDF5EB]' }, 
    { bg: 'bg-[#BD5959]', text: 'text-[#FBE5E5]' }, 
    { bg: 'bg-[#C2824C]', text: 'text-[#4A3414]' }, 
    { bg: 'bg-[#D68A6B]', text: 'text-[#FAF5F2]' }, 
  ],
  // [학습] 차분한 다크 블루 네이비 계열 (미세한 청록빛 틴트 한 방울 변주)
  '학습': [
    { bg: 'bg-[#4B6A8A]', text: 'text-[#F0F4F8]' }, 
    { bg: 'bg-[#3C5778]', text: 'text-[#E5EDF5]' }, 
    { bg: 'bg-[#6D8DA6]', text: 'text-[#F4F7F9]' }, 
    { bg: 'bg-[#456A7A]', text: 'text-[#E9F0F7]' }, 
    { bg: 'bg-[#55698A]', text: 'text-[#F8FAFC]' }, 
  ],
  // [소설] 다크한 신비주의 숲색 & 퍼플 계열 (미세한 더스티 채도 차이)
  '소설': [
    { bg: 'bg-[#5B455B]', text: 'text-[#F9F0F9]' }, 
    { bg: 'bg-[#483B4A]', text: 'text-[#EFE5EF]' }, 
    { bg: 'bg-[#7A4B5A]', text: 'text-[#FCF0F3]' }, 
    { bg: 'bg-[#46544A]', text: 'text-[#E8EFE9]' }, 
    { bg: 'bg-[#735A73]', text: 'text-[#FAF0FA]' }, 
  ],
  // [기타] 무채색 모노톤 계열 (따뜻한 웜그레이와 쿨그레이 교차)
  '기타': [
    { bg: 'bg-[#707070]', text: 'text-[#F2F2F2]' }, 
    { bg: 'bg-[#525252]', text: 'text-[#EAE8E6]' }, 
    { bg: 'bg-[#8F877F]', text: 'text-[#FCFBF9]' }, 
    { bg: 'bg-[#404040]', text: 'text-[#D9D9D9]' }, 
    { bg: 'bg-[#999490]', text: 'text-[#2B2927]' }, 
  ],
};

export function BookCard({ post }: { post: Post }) {
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

  const palette = PALETTES[post.category] || PALETTES['기타'];
  const theme = palette[randomFactor % palette.length];

  const assignedHeight = 'h-[240px]';

  const maxChars = 9;
  const displayTitle = post.title.length > maxChars 
    ? post.title.substring(0, maxChars) + '..' 
    : post.title;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        title={post.title}
        className={`group relative flex flex-col justify-end w-[46px] sm:w-[50px] ${assignedHeight} ${theme.bg} rounded-[2px] 
          transition-transform duration-[400ms] ease-out shrink-0 z-10 hover:z-30 
          hover:-translate-y-5 hover:brightness-105
          shadow-[inset_3px_0_6px_rgba(255,255,255,0.15),inset_-3px_0_6px_rgba(0,0,0,0.15),2px_0_4px_rgba(0,0,0,0.1)]`}
        style={{ willChange: 'transform' }}
      >
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#E8E1DA] rounded-t-[2px] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.1)]"></div>

        <div className="absolute top-5 left-0 right-0 h-[2px] bg-black/15 shadow-[0_4px_0_rgba(255,255,255,0.1)]"></div>
        <div className="absolute top-7 left-0 right-0 h-[1px] bg-black/10"></div>
        
        <div className="flex-1 w-full flex items-center justify-center mt-6 mb-12 px-[2px]">
          <div 
            className={`font-heading text-[13px] sm:text-[14px] font-bold ${theme.text} tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)] opacity-95`}
            style={{ writingMode: 'vertical-rl' }}
          >
            {displayTitle}
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 h-[2px] bg-black/15 shadow-[0_-4px_0_rgba(255,255,255,0.1)]"></div>
        <div className="absolute bottom-8 left-0 right-0 h-[1px] bg-black/10"></div>
        
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-85">
           <span className={`text-[9px] font-bold ${theme.text} uppercase tracking-widest`}>
             {new Date(post.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
           </span>
        </div>
      </button>

      {/* 내부 스크롤 (제목/헤더와 하단 메뉴바는 스크롤되지 않고 픽스되도록 레이아웃 flex-col 로 전면 수정) */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#2B2928]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white border border-[#F0EBE1] shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded overflow-hidden animate-in zoom-in-95 duration-400 ease-[cubic-bezier(0.2,1,0.2,1)]">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 flex items-center justify-center text-[#A89895] hover:text-[#DE6A60] transition-colors hover:bg-[#FCE4E1] rounded-full text-[20px] z-10"
            >
              ✕
            </button>
            
            {/* 고정되는 헤더(제목) 영역 */}
            <div className="shrink-0 pt-8 sm:pt-12 px-6 sm:px-14 pb-6 border-b border-[#F3EFE9] bg-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#FCF8F2] text-[#A68F7B] font-bold text-[12px] rounded-full tracking-wider border border-[#F0EBE1]">{post.category}</span>
                <time className="font-body text-[#A89895] text-[13px] sm:text-[14px] tracking-wide">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                  {' · '}
                  {new Date(post.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
              <h1 className="font-heading text-[2.2rem] sm:text-[2.8rem] tracking-tight font-bold text-[#1A1817] leading-[1.2] pr-10">
                {post.title}
              </h1>
            </div>

            {/* 스크롤 가능한 본문 영역 */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-14 py-8 bg-white/50">
              <div className="prose prose-lg max-w-none min-h-[40vh] flex flex-col">
                <p className="font-body text-[#3A3837] text-[17px] sm:text-[18px] leading-[2.2] whitespace-pre-wrap pb-10 flex-1">
                  {post.content}
                </p>
                
                {/* 하단 서명 (기록 일시) */}
                <div className="mt-8 pt-8 border-t border-[#F3EFE9]/60 text-right opacity-80">
                   <p className="font-body text-[#8C7A70] text-[13px] sm:text-[14px] italic tracking-widest">
                      Written on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                   </p>
                </div>
              </div>
            </div>

            {/* 하단에 고정되는 푸터 바 */}
            <div className="shrink-0 py-5 px-6 sm:px-14 bg-[#FCFCFA] border-t border-[#F3EFE9] flex justify-end">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="font-heading px-4 py-2 text-[#C2B9B4] hover:text-[#9A918C] text-[14px] font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? '정리 중...' : '도서관에서 비우기'}
              </button>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
