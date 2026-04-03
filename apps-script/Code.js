function doPost(e) {
  var sheet = SpreadsheetApp.openById('1Tw5gxFuhhAC5cjL-ktS7tW645DOtJdaYJTUH43Q6NBY').getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['타임스탬프', '이름', '연락처', '문의내용']);
  }

  sheet.appendRow([
    new Date().toLocaleString('ko-KR'),
    data.name,
    data.phone,
    data.message
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
