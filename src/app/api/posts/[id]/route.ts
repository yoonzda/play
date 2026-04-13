import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) return NextResponse.json({ error: '잘못된 ID' }, { status: 400 });

    const body = await request.json();
    const { title, content, category } = body;

    const post = await prisma.post.update({
      where: { id: postId },
      data: { title, content, category },
    });
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Prisma 스키마에서 id가 Int (숫자) 타입으로 설정되어 있기 때문에, URL에서 받아온 문자열을 숫자로 변환해야만 에러 없이 삭제됩니다.
    const postId = parseInt(id, 10);
    
    if (isNaN(postId)) {
      return NextResponse.json({ error: '잘못된 ID 형식입니다.' }, { status: 400 });
    }
    
    await prisma.post.delete({
      where: { id: postId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
