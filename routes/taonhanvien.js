const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối DB

// POST /api/taonhanvien
router.post('/', async (req, res) => {
  try {
    console.log('Dữ liệu nhận được:', req.body);
    const {
      id_user,
      email,
      password,
      role_user,
      department_user,
      qr_code,
      created_at,
      identity_number,
      issued_place,
      issued_date,
      marital_status,
      phone_number,
      address,
    } = req.body;

    // 1. Lưu vào bảng user
    await db.query(
      `INSERT INTO user (id_user, email_user, password_user, role_user, department_user, qr_code_url_user, created_at_user)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_user, email, password, role_user, department_user, qr_code, created_at]
    );

    // 2. Lưu vào bảng employee
    await db.query(
      `INSERT INTO employee (id_user, identity_number, issued_place, issued_date, marital_status, phone_number, address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_user, identity_number, issued_place, issued_date, marital_status, phone_number, address, created_at]
    );

    res.json({ success: true, message: 'Tạo nhân viên thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server!' });
  }
});

module.exports = router;