const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.create({
    data: {
      category: '문장',
      title: '제목이 매우 길어서 두 줄이 넘어가는지 세 줄이 넘어가는지 말줄임표가 제대로 예쁘게 작동해서 카드의 UI가 깨지지 않고 버티는지 테스트하기 위한 아주 긴 세상에서 제일 긴 책 제목 테스트 입니당당당당당당당당당당',
      content: '테스트용 본문입니다.',
    },
  });
  console.log('Created post:', post);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
