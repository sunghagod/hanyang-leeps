function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById('1Tw5gxFuhhAC5cjL-ktS7tW645DOtJdaYJTUH43Q6NBY').getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // 입력값 검증
    var name = (data.name || '').toString().trim();
    var phone = (data.phone || '').toString().trim().replace(/[^0-9\-]/g, '');
    var message = (data.message || '').toString().trim().substring(0, 500);

    if (!name || name.length < 2 || name.length > 20) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', msg: '이름은 2~20자로 입력해주세요.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (!/^01[016789]\d{7,8}$/.test(phone.replace(/-/g, ''))) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', msg: '올바른 연락처를 입력해주세요.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // HTML 태그 제거
    name = name.replace(/<[^>]*>/g, '');
    message = message.replace(/<[^>]*>/g, '');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['타임스탬프', '이름', '연락처', '문의내용']);
    }

    sheet.appendRow([
      new Date().toLocaleString('ko-KR'),
      name,
      phone,
      message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', msg: '서버 오류가 발생했습니다.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
