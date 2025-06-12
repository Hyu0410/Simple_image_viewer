const express = require('express');
const app = express()
const multer = require('multer');
const path = require('path');

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
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}...!`);
});
