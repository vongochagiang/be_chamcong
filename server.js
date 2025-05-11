const express = require('express');
const cors = require('cors');

const app = express();

// Kết nối CSDL
const db = require('./config/db');

// Import route
const nhanvienRoutes = require('./routes/nhanvien');
const loginRoutes = require('./routes/login');
const phantichcongRoutes = require('./routes/phantichcong');
const taonhanvienRoutes = require('./routes/taonhanvien');
const machamcongRoutes = require('./routes/machamcong');
const quetmaRoutes = require('./routes/quetma');
const dangkyRoutes = require('./routes/dangky');
const thongtinRoutes = require('./routes/thongtin');

// Middleware
app.use(cors());
app.use(express.json());

// Khai báo các API endpoint (route prefix)
app.use('/api/nhanvien', nhanvienRoutes);
app.use('/api/login', loginRoutes);
app.use('/api', phantichcongRoutes); // ⚠️ Sửa lại chỗ này
app.use('/api/taonhanvien', taonhanvienRoutes);
app.use('/api/machamcong', machamcongRoutes);
app.use('/api/quetma', quetmaRoutes);
app.use('/api/dangky', dangkyRoutes);
app.use('/api/thongtin', thongtinRoutes); 




// Bắt tất cả request không khớp
app.use((req, res) => {
  res.status(404).json({ error: 'API không tồn tại' });
});

// Khởi chạy server
app.listen(3001, () => {
  console.log('🚀 Server backend đang chạy tại http://localhost:3001');
});
