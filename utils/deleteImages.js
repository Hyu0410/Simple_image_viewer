const fs = require('fs');
const path = require('path');

function clearImageFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) return console.error("폴더 읽기 실패:", err);

    for (const file of files) {
      fs.unlink(path.join(folderPath, file), (err) => {
        if (err) console.error("파일 삭제 실패:", err);
      });
    }
  });
}

module.exports = {
    clearImageFolder
}
