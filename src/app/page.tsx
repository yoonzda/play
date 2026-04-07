import { prisma } from '@/lib/prisma';
import { PageRoot, Header, ContentContainer } from '@/components/ui/layout';
import { WriteMemoButton } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { BookShelfView } from '@/components/BookShelfView';
import { 
  Cat, Coffee, BookOpen, PenTool, Feather, Briefcase, AlarmClock, 
  Rocket, Trophy, Palette, Camera, Hammer, Flower2, Radio, Globe, 
  Gamepad2, Headphones, Laptop, Library, Anchor
} from 'lucide-react';

export const dynamic = 'force-dynamic'; // 실시간 DB 데이터 반영을 위한 Next.js 캐싱 무력화

const CATEGORY_ORDER = ['일상', '문장', '업무', '프로젝트', '작업'];

const WOOD_WALL_STYLE = {
  backgroundColor: '#FCFAF8', // 페이지 배경과 완벽히 동일한 메인 프레임 색상
  backgroundImage: `
    repeating-linear-gradient(
      to right,
      #FCFAF8,
      #FCFAF8 2px,
      #F3EFE9 2px,
      #F3EFE9 4px
    )
  `
};

// 가구의 맨 위/아래를 막아주는 진짜 프레임 선반 (기둥과 동일한 #FCFAF8 화이트 베이스로 완벽 통일)
const WOOD_SHELF_STYLE = {
  backgroundColor: '#FCFAF8',
  backgroundImage: `
    linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.03) 100%),
    repeating-linear-gradient(
      to bottom,
      #FCFAF8,
      #FCFAF8 1px,
      #F3EFE9 1px,
      #F3EFE9 3px
    )
  `,
  boxShadow: '0 8px 20px rgba(0,0,0,0.03), inset 0 2px 2px rgba(255,255,255,1)'
};

// [버그 수정 완료] 책 밑에 자동으로 무한으로 깔리는 내부 선반
// 기둥 및 테두리와 동일한 #FCFAF8 베이스에 하단 음영 라인만 살짝 추가해서 '색상이 따로 노는 현상' 해결
const WOOD_INNER_SHELF_STYLE = {
  backgroundColor: '#FCFAF8',
  backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0px, #FFFFFF 1.5px, #FCFAF8 1.5px, #FCFAF8 15px, #EAE5DC 15px, #EAE5DC 18px)'
};

// 책장 안쪽 공간(뒤쪽 합판 벽) 디자인
// 모던 화이트 갤러리의 깊이감을 표현하는 연한 크림 화이트 내부 컬러
const WOOD_BACKBOARD_STYLE = {
  backgroundColor: '#F3EFE9', 
  // 그림자도 아주 연하고 부드러운 스튜디오 반사광 그림자로 세팅 (까만 그림자 배제)
  boxShadow: 'inset 0 15px 35px rgba(100,90,80,0.06), inset 0 4px 10px rgba(100,90,80,0.03)' 
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
        <BookShelfView groupedPosts={groupedPosts} shelves={shelves} />
      </ContentContainer>
    </PageRoot>
  );
}
