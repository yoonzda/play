import { prisma } from '@/lib/prisma';
import { PageRoot, Header, ContentContainer } from '@/components/ui/layout';
import { WriteMemoButton } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';

export const dynamic = 'force-dynamic'; // 실시간 DB 데이터 반영을 위한 Next.js 캐싱 무력화

const CATEGORY_ORDER = ['일상', '문장', '업무', '프로젝트', '작업'];

// 가장 바깥쪽의 세로 나무 기둥 (고급 나이테 질감 유지)
const WOOD_WALL_STYLE = {
  backgroundColor: '#D1A373',
  backgroundImage: `
    linear-gradient(90deg, rgba(255,255,255,0.03) 10%, transparent 10%, transparent 40%, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0.03) 60%, transparent 60%),
    repeating-linear-gradient(
      to right,
      #D1A373,
      #D1A373 2px,
      #C69766 2px,
      #C69766 4px
    )
  `
};

// 가구의 맨 위/아래를 막아주는 진짜 프레임 선반 (투명도/그림자가 있어서 고급스러움)
const WOOD_SHELF_STYLE = {
  backgroundColor: '#C69766',
  backgroundImage: `
    linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.1) 100%),
    repeating-linear-gradient(
      to bottom,
      #D1A373,
      #D1A373 1px,
      #C69766 1px,
      #C69766 3px
    )
  `,
  boxShadow: '0 8px 15px rgba(0,0,0,0.12), inset 0 2px 2px rgba(255,255,255,0.2)'
};

// [버그 수정 완료] 책 밑에 자동으로 무한으로 깔리는 내부 선반
// 여러 개가 중첩되더라도 흑막(알파 증폭) 오류가 생기지 않도록 투명도(rgba)를 완전히 제거하고 100% 불투명한 솔리드(Solid) 컬러로만 제작.
// 상단 빛 맺힘, 하단 그림자를 완벽한 직사각형 솔리드 그라데이션으로 구축했습니다.
const WOOD_INNER_SHELF_STYLE = {
  backgroundColor: '#C69766',
  backgroundImage: 'linear-gradient(to bottom, #E5CBAB 0px, #E5CBAB 1.5px, #C69766 1.5px, #C69766 15px, #967049 15px, #967049 18px)'
};

// 책장 안쪽 공간(뒤쪽 합판 벽) 디자인
// 가로줄/세로줄이 난잡하게 겹쳐서 화면이 지글거리던 이전 그래픽을 완전히 지우고,
// 책(오브젝트)을 방해하지 않는 매우 매끈하고 깨끗하고 고급스러운(Smooth) 원목 무지판으로 교체했습니다.
const WOOD_BACKBOARD_STYLE = {
  backgroundColor: '#A87A53', // 화사함은 유지하되 눈이 편안하고 차분한 진짜 가구 베이스 컬러
  // 묘하게 남아있던 마지막 세로선(이음새)마저 100% 삭제했습니다. 완전 무결점 배경.
  boxShadow: 'inset 0 20px 35px rgba(0,0,0,0.12), inset 0 4px 8px rgba(0,0,0,0.13)' 
};

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const groupedPosts = posts.reduce((acc, post: any) => {
    const cat = post.category || '작업';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  // 데이터가 텅 비어있어도 5가지 기본 분류(책장)는 항상 예쁘게 전부 보여주기
  const allCategories = Array.from(new Set([...CATEGORY_ORDER, ...Object.keys(groupedPosts)]));
  const shelves = allCategories.sort((a, b) => {
    const i = CATEGORY_ORDER.indexOf(a);
    const j = CATEGORY_ORDER.indexOf(b);
    return (i === -1 ? 99 : i) - (j === -1 ? 99 : j);
  });

  return (
    <PageRoot>
      <Header 
        title="윤지서점" 
        rightContent={<WriteMemoButton href="/admin" />} 
      />
      <ContentContainer>
        <div className="w-full flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-[2px]" style={WOOD_WALL_STYLE}>
          
          <div className="w-full h-[18px] relative z-30" style={WOOD_SHELF_STYLE}></div>

          <div className="flex flex-col px-[18px]"> 
            {shelves.map((category, index) => {
              const currentPosts = groupedPosts[category] || [];
              
              return (
                <section key={category} className="w-full flex flex-col">
                  
                  {/* [세 번째 접근 - 다이어리 감성의 재미 요소] 마스킹 테이프로 무심하게 붙여놓은 종이 라벨 (마우스 올리면 살짝 펄럭임) */}
                  <div className={`w-full h-[75px] flex items-center justify-end relative z-20 overflow-visible pr-8 ${index > 0 ? 'mt-0' : ''}`}>
                      
                      {/* 그룹 호버를 통해 라벨 전체가 살짝 들썩이는 상호작용 */}
                      <div className="relative group cursor-pointer group-hover:-translate-y-1 group-hover:rotate-[-2deg] transition-all duration-300 ease-out z-30">
                        {/* 1. 상단에 붙은 반투명 빈티지 마스킹 테이프 조각 */}
                        <div className="absolute top-[-8px] left-[10%] w-[80%] h-[16px] bg-[#FAF8F0]/70 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.1)] rotate-[-3deg] z-20 
                                        border border-white/30 mix-blend-overlay group-hover:rotate-[-1deg] transition-transform duration-300">
                        </div>
                        {/* 2. 두꺼운 종이 재질의 실제 라벨 */}
                        <div className="relative bg-[#FAFAF8] px-8 py-2 md:py-2.5 shadow-[2px_3px_6px_rgba(0,0,0,0.15)] border border-[#E6E4DF] rotate-[1.5deg]">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>
                          <span className="relative z-10 font-heading font-black text-[#5C4533] text-[13px] md:text-[14px] tracking-[0.3em] uppercase drop-shadow-[0_1px_0_rgba(255,255,255,1)]">
                             {category}
                          </span>
                        </div>
                      </div>

                      <div className="absolute inset-0 z-[-1] shadow-[inset_0_8px_15px_rgba(0,0,0,0.06)] pointer-events-none"></div>
                  </div>
                  
                  <div className="w-full relative overflow-hidden" style={WOOD_BACKBOARD_STYLE}>
                    <div className="flex flex-wrap items-end content-start gap-x-0 gap-y-[3rem] px-0 pt-6 pb-[18px] w-full relative z-10 box-border">
                      
                      {currentPosts.length > 0 ? (
                        currentPosts.map((post: any) => (
                           <div key={post.id} className="relative z-10 flex flex-col justify-end group">
                             <BookCard post={post} />
                             {/* 책 밑을 받쳐주는 안쪽 선반. 책 개수마다 무한히 겹치면서 안전한 가로줄 선반을 형성함 */}
                             <div className="absolute bottom-[-18px] left-0 w-[200vw] h-[18px] z-[-1] pointer-events-none" style={WOOD_INNER_SHELF_STYLE}></div>
                           </div>
                        ))
                      ) : (
                        // 카테고리가 비어있거나 전체 텅 빈 서재일 때 보여주는 '점선으로 된 가상의 비어있는 책(Placeholder)'
                        <div className="relative z-10 flex flex-col justify-end group">
                           {/* 진짜 책(BookCard)과 완전히 똑같은 규격과 정렬 유지 (w-[50px] h-[240px]) */}
                           {/* [센스 UX 추가] href 링크에 category 파라미터 추가하여 글쓰기 진입 시 자동 선택되게 구성 */}
                           <a href={`/admin?category=${category}`} title={`${category} 분류에 새 책 꽂기`} className="group/empty relative flex flex-col justify-end w-[46px] sm:w-[50px] h-[240px] shrink-0 hover:-translate-y-4 transition-transform duration-[400ms] ease-out cursor-pointer z-10 hover:z-30">
                              
                              {/* 호버했을 때의 명확하고 진한 컬러(bg-[#EBE3D5]/40, border-[#8F6A4A])를 아예 기본 상태로 끌어올림 */}
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
                           {/* 빈 책 밑에도 선반이 그려져야 함 */}
                           <div className="absolute bottom-[-18px] left-0 w-[200vw] h-[18px] z-[-1] pointer-events-none" style={WOOD_INNER_SHELF_STYLE}></div>
                        </div>
                      )}
                      
                    </div>
                  </div>
                  
                  {/* 구조물의 하중을 막아주는 안전한 불투명/입체감 바닥 프레임 */}
                  <div className="w-full h-[18px] relative z-20" style={WOOD_SHELF_STYLE}></div>

                </section>
              );
            })}
          </div>
          
        </div>
      </ContentContainer>
    </PageRoot>
  );
}
