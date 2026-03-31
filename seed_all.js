const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const categories = ['일상', '영감', '학습', '소설', '기타'];
  console.log('📚 대규모 도서 입고 작업을 시작합니다...');

  for (const cat of categories) {
    console.log(`>> "${cat}" 구역에 도서 12권씩 배치 중...`);
    
    for (let i = 1; i <= 12; i++) {
      // 본문 내용을 아주 길게 넣어서 새로 짠 모달창 내부 스크롤이 잘 작동하는지 테스트
      const longContent = `이 기록은 "${cat}" 분야에 꽂혀 있는 소중한 책장 속 ${i}번째 서랍입니다.\n\n`
        + `[팝업 스크롤 테스트용 긴 문단 영역]\n\n` 
        + `위쪽의 제목 영역(헤더)과 맨 아래쪽의 '비우기' 버튼(푸터)은 화면에 단단히 고정된 채로,\n이 내용 부분만 깔끔하게 스크롤되는지 테스트해보실 수 있도록 길게 작성해 둔 예제 텍스트입니다.\n\n`
        + `(스크롤을 내리기 위해 반복되는 텍스트)\n`.repeat(30)
        + `\n[테스트 끝] 정말로 제목과 삭제 버튼이 화면 밖으로 도망가지 않고 깔끔하게 고정되어 있나요?`;

      await prisma.post.create({
        data: {
          title: `[${cat}] 나의 조각들 Vol.${i}`,
          content: longContent,
          category: cat,
        }
      });
    }
  }
  
  console.log('✅ 총 60권(카테고리별 12권)의 데이터가 도서관에 무사히 꽂혔습니다!');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
