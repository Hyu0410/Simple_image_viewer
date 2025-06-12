const express = require('express');
const app = express()
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { clearImageFolder } = require('./utils/deleteImages');

const PORT = 8000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/img/'); // 저장할 폴더
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  },
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use("/src/img", express.static(path.join(__dirname, "src/img")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.post('/upload', (req, res, next) => {
    clearImageFolder(path.join(__dirname, 'src/img'));

    upload.any()(req, res, (err) => {
        if (err) {
            return next(err); // 에러가 나면 다음 에러 처리 미들웨어로 넘김
        }
        res.json({ message: '업로드가 완료되었습니다!!' });
    });
})

app.get('/img/view', (req, res) => {
    const imageDir = path.join(__dirname, "src/img");

    fs.readdir(imageDir, (err, files) => {
    if (err) {
      return res.status(500).send("서버 에러");
    }

    const imagePaths = files.map(file => `/src/img/${file}`);

    let html = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>이미지 슬라이더</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 20px;
          }
          img {
            max-width: 100%;  
            height: auto;   
            display: block;  
            margin: 0 auto;  
          }
          button {
            margin: 10px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #4d59aa; 
            color: white; 
            border: none; 
            border-radius: 5px;
            cursor: pointer; 
            transition: background-color 0.3s ease;
          }
        </style>
      </head>
      <body>
        <div>
          <img id="sliderImage" src="${imagePaths[0] || ''}" alt="이미지" />
        </div>

        <div id="button">
          <button id="prevBtn">이전</button>
          <button id="nextBtn">다음</button>
        </div>
        <script>
          const images = ${JSON.stringify(imagePaths)};
          let currentIndex = 0;
          const imgElem = document.getElementById('sliderImage');

          document.getElementById('prevBtn').addEventListener('click', () => {
            if (images.length === 0) return;
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            imgElem.src = images[currentIndex];
          });

          document.getElementById('nextBtn').addEventListener('click', () => {
            if (images.length === 0) return;
            currentIndex = (currentIndex + 1) % images.length;
            imgElem.src = images[currentIndex];
          });
        </script>
      </body>
      </html>
    `;

    res.send(html);
  });
})

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}...!`);
});
