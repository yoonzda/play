'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageRoot, Header, ContentContainer } from '@/components/ui/layout';
import { SecondaryLink, PrimarySubmitButton } from '@/components/ui/button';

const CATEGORIES = ['일상', '영감', '학습', '소설', '기타'];

function AdminForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Next.js 전용 라우터 훅을 사용하여 최초 렌더링(SSR)부터 파라미터를 읽어오므로 '번쩍'하고 바뀌는 현상이 완전히 사라짐
  const initCat = searchParams.get('category');
  const initialCategory = initCat && CATEGORIES.includes(initCat) ? initCat : CATEGORIES[0];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={handleSubmit} className="w-full flex flex-col lg:flex-row gap-8 md:gap-12">
      
      {/* 왼쪽 영역: 도서 메타데이터 설정 (분류, 제목 등) */}
      <div className="w-full lg:w-[35%] flex flex-col space-y-12">
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#F3EFE9] shadow-[0_15px_40px_rgba(0,0,0,0.02)] h-full">
          <div className="mb-14">
            <label className="font-heading block text-[15px] font-bold text-[#A8A09C] mb-6 uppercase tracking-widest">1. 책 꽂을 위치 (분류)</label>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`font-heading px-6 py-3 rounded-full font-bold text-[14px] transition-all duration-300 border-2 ${
                    category === cat 
                      ? 'bg-[#E68A81] border-[#E68A81] text-white shadow-[0_4px_12px_rgba(230,138,129,0.3)] -translate-y-1 scale-105' 
                      : 'bg-[#FCFAF8] border-transparent text-[#A8A09C] hover:border-[#E68A81] hover:text-[#BD5F55] hover:bg-white'
                  }`}
                >
                  # {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-heading block text-[15px] font-bold text-[#A8A09C] mb-4 uppercase tracking-widest">2. 책 제목 지정</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-body w-full pb-4 border-b-2 border-[#EBE6E0] focus:border-[#E68A81] bg-transparent outline-none transition-colors text-[32px] md:text-[40px] font-bold placeholder-[#D4CCC8] text-[#1A1817] rounded-none focus:ring-0 leading-tight"
              placeholder="제목을 지어주세요"
            />
          </div>
        </div>
      </div>

      {/* 오른쪽 영역: 거대한 원고 집필 공간 (에디터) */}
      <div className="w-full lg:w-[65%] flex flex-col bg-white border border-[#EBE6E0] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 md:p-12 pb-6 flex-grow flex flex-col">
          <label className="font-heading block text-[15px] font-bold text-[#A8A09C] mb-6 uppercase tracking-widest">3. 상세 내용 (원고)</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-body flex-grow w-full bg-[#FCFAF8] rounded-xl border border-[#EBE6E0] focus:border-[#E68A81] focus:bg-[#FFFDFB] outline-none transition-all text-[#2E2C2B] min-h-[500px] p-8 resize-none leading-[2.2] text-[17px] md:text-[18px] placeholder-[#C2B9B4]"
            placeholder="세상에 남길 이야기를 맘껏 펼치세요..."
          />
        </div>
        
        {/* 발행 버튼 영역 */}
        <div className="px-8 md:px-12 pb-8 md:pb-12 pt-0 bg-white">
          <PrimarySubmitButton loading={loading} text="도서관에 이 책을 출판하기" />
        </div>
      </div>
      
    </form>
  );
}

export default function AdminPage() {
  return (
    <PageRoot>
      <Header 
        title="도서관에 책 쓰기" 
        rightContent={<SecondaryLink href="/">도서관으로</SecondaryLink>} 
      />
      
      {/* 화면 전체를 좌/우로 꽉 차게 쓰는 프리미엄 스플릿(Split) 레이아웃 */}
      <ContentContainer>
        <Suspense fallback={<div className="font-body text-[#A8A09C] py-20 text-center">페이지 준비 중...</div>}>
          <AdminForm />
        </Suspense>
      </ContentContainer>
    </PageRoot>
  );
}
