const express = require('express');
const router = express.Router();
const db = require('../config/db');

// API nhận dữ liệu QR và lưu chấm công (check-in/check-out)
router.post('/', async (req, res) => {
  //  return res.json({body:req.body})
  try {
    
     const  method = 'qr';
     const qrData = {id_user:"1", name:"A"}
    const {  reason = '', created_by = null } = req.body;
    if (!qrData) {
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu QR!' });
    }

    // Parse QR data

    let parsed;
    
    try {
      parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch (err) {
      return res.status(400).json({ success: false, message: 'QR không hợp lệ! Không phải JSON.' });
    }

    const idUserInt = parseInt(parsed.id_user, 10);
    if (!idUserInt) {
      return res.status(400).json({ success: false, message: 'QR không chứa id_user hợp lệ!' });
    }

    // Lấy ngày hiện tại
    const today = new Date().toISOString().slice(0, 10);
    // return res.json({mess:today, mess2:idUserInt});

    // Kiểm tra đã check-in hôm nay chưa
    // const [rows] = await db.query(
    //   'SELECT * FROM attendance WHERE id_user = ? AND work_date = ?',
    //   [idUserInt, today]
    // );


    db.query(
      'SELECT * FROM attendance WHERE id_user = ? AND work_date = ?',
      [idUserInt, today],
      (err, results, fields) => {
        if (err) {
          console.error('Lỗi truy vấn:', err);
          res.status(500).json({ success: false, message: 'Lỗi server!' });
        } else {
          res.json({ success: true, data: results });
        }
      }
    );
    

    if (!rows || rows.length === 0) {
      // Chưa check-in: tạo mới
      await db.query(
        `INSERT INTO attendance (id_user, work_date, check_in, method)
         VALUES (?, CURDATE(), CURTIME(), 'QR')`,
        [idUserInt]
      );
      return res.json({ success: true, message: 'Check-in thành công!' });
    } else {
      // Đã check-in, kiểm tra check_out
      const attendance = rows[0];
      if (!attendance.check_out) {
        // Chưa check-out: cập nhật check_out và tính total_hours
        const checkInTime = new Date(attendance.check_in);
        const checkOutTime = new Date();
        const totalHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);

        await db.query(
          `UPDATE attendance SET check_out = CURTIME(), total_hours = ?, reason = ? WHERE id = ?`,
          [totalHours, reason, attendance.id]
        );
        return res.json({ success: true, message: 'Check-out thành công!', total_hours: totalHours });
      } else {
        // Đã check-in và check-out rồi
        return res.json({ success: false, message: 'Bạn đã check-in và check-out hôm nay rồi!' });
      }
    }
  } catch (err) {
    console.error('Lỗi chấm công:', err);
    res.status(500).json({ success: false, message: 'Lỗi server!', error: err.message, stack: err.stack });
  }
});

module.exports = router;
