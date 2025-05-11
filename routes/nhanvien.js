// server/routes/nhanvien.js
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db'); // file kết nối MySQL bạn đã có

// router.get('/', (req, res) => {
//   const sql = 'SELECT * FROM employee'; // bảng "nhanvien" trong MySQL
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

// module.exports = router;
// server/routes/nhanvien.js




// const express = require('express');
// const router = express.Router();
// const db = require('../config/db'); // file kết nối MySQL bạn đã có

// // Lấy danh sách tất cả nhân viên kèm theo thông tin tài khoản
// router.get('/', (req, res) => {
//   const sql = `
//     SELECT e.*, u.name_user 
//     FROM employee e
//     LEFT JOIN user u ON e.id_user = u.id_user
//   `;
//   const sql1='select * from user';
//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     }
//     res.json(results);
//   });
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách tất cả nhân viên kèm thông tin từ bảng user
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      e.*, 
      u.name_user, 
      u.role_user
    FROM employee e
    LEFT JOIN user u ON e.id_user = u.id_user
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});


// router.put('/:id', (req, res) => {
//   const id = req.params.id;
//   const {
//     identity_number,
//     issued_place,
//     issued_date,
//     marital_status,
//     phone_number,
//     address,
//   } = req.body;

//   const sql = `
//     UPDATE employee
//     SET 
//       identity_number = ?, 
//       issued_place = ?, 
//       issued_date = ?, 
//       marital_status = ?, 
//       phone_number = ?, 
//       address = ?
//     WHERE id = ?
//   `;

//   db.query(sql, [identity_number, issued_place, issued_date, marital_status, phone_number, address, id], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ success: true, message: 'Cập nhật thành công' });
//   });
// });

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const {
    identity_number,
    issued_place,
    issued_date,
    marital_status,
    phone_number,
    address,
  } = req.body;

  console.log("📦 Dữ liệu nhận được:", req.body);
  console.log("🆔 ID cần cập nhật:", id);

  const sql = `
    UPDATE employee
    SET 
      identity_number = ?, 
      issued_place = ?, 
      issued_date = ?, 
      marital_status = ?, 
      phone_number = ?, 
      address = ?
    WHERE id = ?
  `;

  db.query(sql, [identity_number, issued_place, issued_date, marital_status, phone_number, address, id], (err, result) => {
    if (err) {
      console.error("❌ Lỗi MySQL:", err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên để cập nhật" });
    }

    res.json({ success: true, message: 'Cập nhật thành công' });
  });
});




module.exports = router;