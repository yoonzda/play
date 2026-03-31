const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('📚 학습용 도서 40권 대량 추가 작업을 시작합니다...');

  for (let i = 1; i <= 40; i++) {
    await prisma.post.create({
      data: {
        title: `알쓸신잡 개발 & 디자인 노트 Vol.${i}`,
        content: `이 책은 볼륨 ${i}에 해당하는 학습 노트입니다.\n\n책장이 꽉 찼을 때 어떻게 보일까 테스트하기 위한 엄청난 대량의 데이터입니다.\n수십 권의 책이 차곡차곡 쌓이는 장관을 구경해보세요!`,
        category: '학습',
      }
    });
  }
  
  console.log('✅ 40권 추가 도서 출판 완료!');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
