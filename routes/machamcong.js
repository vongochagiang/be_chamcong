const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối DB

// Lấy mã QR của nhân viên theo id_user
router.get('/:id_user', async (req, res) => {
//    return  res.json({
//         success: true,
//         message: 'API /api/machamcong được gọi thành công!'
//       });

  const id_user = parseInt(req.params.id_user, 10);

const sql = `SELECT id_user, name_user, email_user, qr_code_url_user FROM user WHERE id_user = ${id_user} `

  try {
    // Lấy thông tin user từ DB
    //return res.status(200).json({success:'ok'})
     const [rows] = await db.query(sql)
   

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên!' });
    }

    // Trả về thông tin nhân viên và mã QR
    console.log('id_user nhận được:', id_user);
    res.json({
      success: true,
      user: rows[0]
    });
  } catch (err) {
    console.error('Lỗi lấy mã QR:', err);
    res.status(500).json({ success: false, message: 'Lỗi server!' +  
        'SELECT id_user, name_user, email_user, qr_code_url_user FROM user WHERE id_user = '+id_user });
  }
});

router.get('/me', async (req, res) => {
  console.log('API /api/user/me được gọi với user:', req.user);
  try {
    const { id_user } = req.user;
    const [rows] = await db.query(
      'SELECT id_user, name_user, email_user FROM user WHERE id_user = ?',
      [id_user]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên!' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Lỗi lấy thông tin user:', err);
    res.status(500).json({ success: false, message: 'Lỗi server!' });
  }
});

module.exports = router;