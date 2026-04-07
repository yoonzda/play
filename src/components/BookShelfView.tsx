'use client';

import { useState, useEffect } from 'react';
import { BookCard } from '@/components/BookCard';
import { Library, List } from 'lucide-react';

// 기존 책장 스타일 포팅
// 새로운 컬러 제안: [세이지 그린 (Sage Green)] - 트렌디한 독립 서점 느낌, 테두리/선반 색상 완벽 통일
const WOOD_WALL_STYLE = {
  backgroundColor: '#D4DBD6', // 프레임 베이스 색상
  backgroundImage: `
    repeating-linear-gradient(
      to right,
      #D4DBD6,
      #D4DBD6 2px,
      #CED5D0 2px,
      #CED5D0 4px
    )
  `
};

const WOOD_SHELF_STYLE = {
  backgroundColor: '#D4DBD6', // 가로 선반도 프레임과 동일한 색상으로 통일!
  backgroundImage: `
    linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.06) 100%),
    repeating-linear-gradient(
      to bottom,
      #D4DBD6,
      #D4DBD6 1px,
      #C6CCC8 1px,
      #C6CCC8 3px
    )
  `,
  boxShadow: '0 8px 15px rgba(20,40,30,0.08), inset 0 2px 2px rgba(255,255,255,0.6)'
};

const WOOD_INNER_SHELF_STYLE = WOOD_SHELF_STYLE; // 내부 선반도 외부 선반과 완전히 동일한 스타일 공유

const WOOD_BACKBOARD_STYLE = {
  backgroundColor: '#BAC3BC', // 하얀 책들이 도드라질 수 있도록 살짝 명도를 낮춘 뒷배경 벽
  boxShadow: 'inset 0 20px 40px rgba(40,60,50,0.12), inset 0 4px 10px rgba(40,60,50,0.06)' 
};

export function BookShelfView({ groupedPosts, shelves }: { groupedPosts: any, shelves: string[] }) {
  const [viewMode, setViewMode] = useState<'bookshelf' | 'list'>('bookshelf');

  return (
    <div className="w-full relative flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `
        /* 세로 스크롤바 완전 숨김 (목록 뷰 내부용) */
        .hide-vertical-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
        }
        .hide-vertical-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        
        /* 가로 스크롤바 완전 숨김 (바인더 뷰 외부용) */
        .hide-horizontal-scrollbar::-webkit-scrollbar {
          display: none !important;
          height: 0 !important;
        }
        .hide-horizontal-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />
      {/* 뷰 토글 스위치 및 버튼 */}
      <div className="absolute -top-[52px] right-0 z-10 flex items-center justify-end gap-3">
        {/* 매뉴얼 스크롤 화살표 (바인더 리스트 모드일 때만 표시) */}
        {viewMode === 'list' && (
           <div className="flex items-center bg-[#FCFAF8]/90 backdrop-blur-sm p-1.5 rounded-[12px] border border-[#EAE5DF] shadow-[0_2px_10px_rgba(0,0,0,0.03)] animate-[fadeIn_0.5s_forwards]">
             <button 
               onClick={() => document.getElementById('archive-container')?.scrollBy({ left: -420, behavior: 'smooth' })}
               className="w-[36px] h-[36px] flex items-center justify-center text-[#A89895] hover:bg-[#111] hover:text-white rounded-[8px] transition-colors"
               aria-label="이전 카테고리 보기"
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </button>
             <button 
               onClick={() => document.getElementById('archive-container')?.scrollBy({ left: 420, behavior: 'smooth' })}
               className="w-[36px] h-[36px] flex items-center justify-center text-[#A89895] hover:bg-[#111] hover:text-white rounded-[8px] transition-colors ml-1"
               aria-label="다음 카테고리 보기"
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
             </button>
           </div>
        )}

        {/* 뷰 토글 스위치 (알약 탭) */}
        <div className="relative flex items-center bg-[#FCFAF8]/90 backdrop-blur-sm p-1.5 rounded-[12px] border border-[#EAE5DF] shadow-[0_2px_10px_rgba(0,0,0,0.03)] inline-flex">
        {/* 스르륵 움직이는 활성화 백그라운드 */}
        <div 
          className="absolute top-1.5 bottom-1.5 w-[54px] bg-white rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#F3EFE9] transition-transform duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ transform: viewMode === 'bookshelf' ? 'translateX(0)' : 'translateX(60px)' }}
        ></div>

        <button 
          onClick={() => setViewMode('bookshelf')}
          className={`relative w-[54px] h-[36px] flex items-center justify-center transition-colors duration-300 z-10 outline-none ${viewMode === 'bookshelf' ? 'text-[#5C7E6A]' : 'text-[#B5A8A4] hover:text-[#888]'}`}
          title="책장 뷰"
        >
          {/* Library (책) 아이콘 */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
        </button>
        
        <button 
          onClick={() => setViewMode('list')}
          className={`relative w-[54px] h-[36px] flex items-center justify-center transition-colors duration-300 z-10 ml-[6px] outline-none ${viewMode === 'list' ? 'text-[#A62B2B]' : 'text-[#B5A8A4] hover:text-[#888]'}`}
          title="바인더 뷰"
        >
          {/* 가로 배열 폴더 아이콘 */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        </button>
        </div>
      </div>

      {viewMode === 'bookshelf' ? (
        <div className="w-full flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-[2px]" style={WOOD_WALL_STYLE}>
          <div className="w-full h-[22px] relative z-30" style={WOOD_SHELF_STYLE}></div>

          <div className="flex flex-col px-[18px]"> 
            {shelves.map((category) => {
              const currentPosts = groupedPosts[category] || [];
              
              return (
                <section key={category} className="w-full flex flex-col group/section">
                  <div className="w-full relative overflow-hidden" style={WOOD_BACKBOARD_STYLE}>
                    
                    {/* 그림자 겹침을 방지하기 위한 배경 스마트 트랙 (다중 행 렌더링 지원) */}
                    <div className="absolute top-[272px] left-0 w-full h-[22px] z-0 pointer-events-none" style={WOOD_INNER_SHELF_STYLE}></div>
                    <div className="absolute top-[568px] left-0 w-full h-[22px] z-0 pointer-events-none" style={WOOD_INNER_SHELF_STYLE}></div>
                    <div className="absolute top-[864px] left-0 w-full h-[22px] z-0 pointer-events-none" style={WOOD_INNER_SHELF_STYLE}></div>
                    <div className="absolute top-[1160px] left-0 w-full h-[22px] z-0 pointer-events-none" style={WOOD_INNER_SHELF_STYLE}></div>

                    <div className="flex flex-wrap items-end content-start gap-x-0 gap-y-[3.5rem] px-0 pt-8 pb-0 w-full relative z-10 box-border">
                      
                      {currentPosts.length > 0 ? (
                        currentPosts.map((post: any) => (
                           <div key={post.id} className="relative z-10 hover:z-[999] flex flex-col justify-end">
                             <BookCard post={post} />
                           </div>
                        ))
                      ) : (
                        <div className="relative z-10 flex flex-col justify-end group">
                           <a href={`/admin?category=${category}`} title={`${category} 분류에 새 책 꽂기`} className="group/empty relative flex flex-col justify-end w-[46px] sm:w-[50px] h-[240px] shrink-0 hover:-translate-y-4 transition-transform duration-[400ms] ease-out cursor-pointer z-10 hover:z-30">
                              <div className="absolute inset-0 border-[2px] border-dashed border-[#8F6A4A]/80 bg-[#EBE3D5]/40 rounded-[2px] group-hover/empty:bg-[#E0D4C0]/50 group-hover/empty:border-[#6B4E31] transition-colors flex flex-col items-center justify-center gap-4">
                                 <div className="w-[24px] h-[24px] rounded-full bg-[#8F6A4A] flex items-center justify-center group-hover/empty:bg-[#6B4E31] transition-colors shadow-sm">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F3EFE9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                       <line x1="12" y1="5" x2="12" y2="19"></line>
                                       <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                 </div>
                                 <span className="font-heading font-black text-[#6B4E31] opacity-100 text-[12px] sm:text-[13px] tracking-[0.3em] group-hover/empty:text-[#4A3420]" style={{ writingMode: 'vertical-rl' }}>
                                   새 책 꽂기
                                 </span>
                              </div>
                           </a>
                        </div>
                      )}
                      
                    </div>
                  </div>
                  
                  <div className="w-full h-[22px] relative z-20" style={WOOD_SHELF_STYLE}></div>

                </section>
              );
            })}
          </div>
        </div>
      ) : (
        // [완전히 새롭고 신박한 모드] 인터랙티브 아카이브 바인더 레이아웃 (가로 스크롤 카드 덱)
        <div className="w-full">
          {/* 가이드 컨트롤은 상단 화살표 버튼으로 대체, 스크롤바 완전히 숨김 */}
          <div id="archive-container" className="flex flex-nowrap overflow-x-auto gap-6 sm:gap-8 pb-10 snap-x snap-mandatory scroll-smooth w-full hide-horizontal-scrollbar">
            {shelves.map((category) => {
              const currentPosts = groupedPosts[category] || [];
              
              return (
                <div key={category} className="shrink-0 w-[88vw] sm:w-[380px] md:w-[420px] h-[calc(100vh-250px)] min-h-[480px] max-h-[700px] flex flex-col bg-white rounded-[6px] shadow-sm border border-[#EAE5DF] snap-start relative overflow-hidden transition-all duration-500 hover:border-[#D4C9C7] hover:shadow-md">
                  
                  {/* 빈티지 서랍 헤더 */}
                  <div className="px-6 sm:px-8 py-6 border-b border-dashed border-[#D4C9C7] flex justify-between items-center bg-[#FCFAF8] z-10 shrink-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-[#A89895] text-[11px] tracking-[0.25em] font-mono font-bold">ARCHIVE BINDER</span>
                      <h3 className="font-heading font-black text-[24px] sm:text-[28px] tracking-wide text-[#111]">{category}</h3>
                    </div>
                    
                    {/* 카운팅 태그 */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-full border border-[#EAE5DF] shadow-sm">
                      <span className="text-[#A62B2B] font-bold font-mono text-[18px] leading-none">{currentPosts.length}</span>
                      <span className="text-[#A89895] text-[9px] font-mono leading-none mt-1">VOL</span>
                    </div>
                  </div>

                  {/* 서랍 본문 (내부 개별 스크롤, 스크롤바 완전 숨김) */}
                  <div className="flex-1 overflow-y-auto w-full bg-[#FCFAF8]/40 hide-vertical-scrollbar">
                    {currentPosts.length > 0 ? (
                      <div className="flex flex-col">
                        {currentPosts.map((post: any) => (
                           // 기존 BookCard의 리스트 모드 활용
                           <div className="px-2" key={post.id}>
                             <BookCard post={post} variant="list" />
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-[#A89895] gap-3 opacity-60">
                         <div className="w-12 h-12 rounded-full border border-dashed border-[#D4C9C7] flex items-center justify-center">
                           <span className="block w-1.5 h-1.5 rounded-full bg-[#D4C9C7]"></span>
                         </div>
                         <span className="text-[14px]">아직 보관된 기록이 없습니다</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
