const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lưu đăng ký lịch làm vào bảng work
router.post('/save', async (req, res) => {
  try {
    const { id_user, year, month, days } = req.body;
    if (!id_user || !year || !month || !days) {
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu!' });
    }

    // Xóa các đăng ký cũ của tháng này
    await db.query(
      'DELETE FROM work WHERE id_user = ? AND YEAR(date_work) = ? AND MONTH(date_work) = ?',
      [id_user, year, month]
    );

    // Lưu từng ngày
    for (const day of days) {
      if (day.status !== 'work') continue; // Chỉ lưu những ngày có ca làm

      const date_work = `${year}-${String(month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
      const start_work = day.shifts[0]?.startTime || null;
      const end_work = day.shifts[0]?.endTime || null;
      const now = new Date();
      const created_at_work = now.toISOString().slice(0, 19).replace('T', ' ');
      const updated_at_work = created_at_work;

      // Log dữ liệu để debug
      console.log({ id_user, date_work, start_work, end_work, created_at_work, updated_at_work });

      await db.query(
        `INSERT INTO work 
          (id_user, date_work, start_work, end_work, created_at_work, updated_at_work) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_user, date_work, start_work, end_work, created_at_work, updated_at_work]
      );
    }

    res.json({ success: true, message: 'Lưu đăng ký lịch làm thành công!' });
  } catch (err) {
    console.error('Lỗi lưu đăng ký lịch làm:', err);
    res.status(500).json({ success: false, message: 'Lỗi server!' });
  }
});

module.exports = router;
