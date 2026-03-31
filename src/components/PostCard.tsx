'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Post = {
  // DB 스키마에 맞춰 고유 ID를 숫자형(number)으로 정확히 수정하여 타입 충돌을 방지합니다.
  id: number;
  title: string;
  content: string;
  createdAt: Date;
};

export function PostCard({ post }: { post: Post }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('정말 이 메모를 완전히 삭제할까요?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('삭제 실패');
      
      router.refresh();
    } catch (error) {
      alert('메모 삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    }
  };

  return (
    <article 
      onClick={() => setIsExpanded(!isExpanded)}
      className="group p-8 rounded bg-white border border-[#F3EFE9] shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(230,138,129,0.08)] hover:-translate-y-1 transition-all duration-400 cursor-pointer relative"
    >
      <header className="mb-4">
        <div className="flex justify-between items-start gap-4">
          <h2 className={`font-heading text-[1.4rem] leading-tight text-[#1A1817] group-hover:text-[#DE6A60] transition-colors duration-300 ${isExpanded ? '' : 'line-clamp-1'}`}>
            {post.title}
          </h2>
          <div className="flex items-center gap-4 shrink-0 mt-1">
            <time className="font-body text-[12px] text-[#A89895] uppercase tracking-widest">
              {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="font-heading text-[#C2B9B4] hover:text-white text-[11px] font-bold px-2 py-1 rounded transition-colors duration-200 hover:bg-[#DE6A60] disabled:opacity-50"
              title="이 메모 삭제하기"
            >
              {isDeleting ? '...' : '삭제'}
            </button>
          </div>
        </div>
      </header>
      <div className="relative">
        <p className={`font-body whitespace-pre-wrap text-[#4A4745] text-[16px] leading-[1.8] transition-all duration-300 ${isExpanded ? '' : 'line-clamp-4'}`}>
          {post.content}
        </p>
        {!isExpanded && (
          <div className="mt-3 text-[13px] font-bold text-[#DE6A60] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            자세히 보기 ↓
          </div>
        )}
        {isExpanded && (
          <div className="mt-3 text-[13px] font-bold text-[#A89895] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            접어두기 ↑
          </div>
        )}
      </div>
    </article>
  );
}
