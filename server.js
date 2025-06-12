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

app.get('/uploadImage-duriAdmin-344912371038', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.post('/upload-344912371038', (req, res, next) => {
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
      <title>Image Viewer</title>
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
          #indicators span {
            color: #ccc;
            font-size: 20px;
            cursor: pointer;
            transition: color 0.3s ease;
            }

            #indicators .active {
            color: #4d59aa;
            font-size: 28px;
            text-shadow: 0 0 5px #4d59aa;
            }
      </style>
    </head>
    <body>
      <div id="sliderContainer">
        <div id="spinner"></div>
        <img id="sliderImage" src="" alt="이미지 슬라이더" style="display:none" />
        <div id="message" style="display:none">이미지가 없습니다.</div>
        <div id="buttons" style="display:none">
          <button id="prevBtn" aria-label="이전 이미지">이전</button>
          <button id="nextBtn" aria-label="다음 이미지">다음</button>
        </div>
        <div id="indicators" style="display:none"></div>
      </div>

      <script>
        const images = ${JSON.stringify(imagePaths)};

        const imgElem = document.getElementById('sliderImage');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicators = document.getElementById('indicators');
        const message = document.getElementById('message');
        const spinner = document.getElementById('spinner');
        const buttonsDiv = document.getElementById('buttons');

        let currentIndex = 0;

        function showSpinner(show) {
          spinner.style.display = show ? 'block' : 'none';
        }

        function updateImage() {
          if(images.length === 0) {
            message.style.display = 'block';
            buttonsDiv.style.display = 'none';
            indicators.style.display = 'none';
            imgElem.style.display = 'none';
            spinner.style.display = 'none';
            return;
          }

          showSpinner(true);
          imgElem.style.display = 'none';
          imgElem.alt = \`이미지 \${currentIndex + 1} / \${images.length}\`;

          imgElem.onload = () => {
            showSpinner(false);
            imgElem.style.display = 'block';
            message.style.display = 'none';
          };
          imgElem.onerror = () => {
            showSpinner(false);
            message.textContent = "이미지를 불러오는데 실패했습니다.";
            message.style.display = "block";
            imgElem.style.display = 'none';
          };

          imgElem.src = images[currentIndex];

          [...indicators.children].forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
          });
        }

        function initIndicators() {
          indicators.innerHTML = '';
          images.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.textContent = '●';
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', \`이미지 \${idx + 1} 보기\`);
            dot.tabIndex = 0;
            dot.className = idx === 0 ? 'active' : '';
            dot.addEventListener('click', () => {
              currentIndex = idx;
              updateImage();
            });
            dot.addEventListener('keydown', e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentIndex = idx;
                updateImage();
              }
            });
            indicators.appendChild(dot);
          });
        }

        function showSlider() {
          if (images.length === 0) {
            message.style.display = 'block';
            buttonsDiv.style.display = 'none';
            indicators.style.display = 'none';
            imgElem.style.display = 'none';
            spinner.style.display = 'none';
          } else {
            message.style.display = 'none';
            buttonsDiv.style.display = 'block';
            indicators.style.display = 'block';
            updateImage();
            initIndicators();
          }
        }

        prevBtn.addEventListener('click', () => {
          if (images.length === 0) return;
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          updateImage();
        });

        nextBtn.addEventListener('click', () => {
          if (images.length === 0) return;
          currentIndex = (currentIndex + 1) % images.length;
          updateImage();
        });

        // 터치 스와이프 지원
        let startX = 0;
        imgElem.addEventListener('touchstart', e => {
          startX = e.touches[0].clientX;
        });
        imgElem.addEventListener('touchend', e => {
          let endX = e.changedTouches[0].clientX;
          const swipeThreshold = 50;

          if (startX - endX > swipeThreshold) {
            nextBtn.click();
          } else if (endX - startX > swipeThreshold) {
            prevBtn.click();
          }
        });

        // 전체화면 보기 기능
        imgElem.addEventListener('click', () => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            imgElem.requestFullscreen().catch(() => {
              alert("전체화면 모드를 지원하지 않는 브라우저입니다.");
            });
          }
        });

        showSlider();
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
