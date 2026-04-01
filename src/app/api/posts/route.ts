import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(posts); // 도서관의 모든 책 응답
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { title, content, category } = json;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        // 새로 추가된 카테고리를 저장 (없으면 강제 '작업' 부여)
        category: category || "작업"
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
