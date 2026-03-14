const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Cho phép React gọi API
app.use(express.json()); // Cho phép Node.js đọc dữ liệu JSON gửi lên

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('Server Backend Bán Kính AR đang chạy ngon lành!');
});

// Port chạy server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng http://localhost:${PORT}`);
});