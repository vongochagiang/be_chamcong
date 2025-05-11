const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Tính số giờ giữa 2 thời điểm HH:mm:ss
function calculateHours(start, end) {
  if (!start || !end) return 0;

  const [sh, sm, ss] = start.split(':').map(Number);
  const [eh, em, es] = end.split(':').map(Number);

  const startDate = new Date(0, 0, 0, sh, sm, ss);
  const endDate = new Date(0, 0, 0, eh, em, es);

  let diff = (endDate - startDate) / (1000 * 60 * 60); // giờ

  if (diff < 0) diff += 24; // làm qua đêm

  return parseFloat(diff.toFixed(2));
}

// Tính giờ làm đêm (sau 22:00)
function calculateNightHours(checkin, checkout) {
  if (!checkin || !checkout) return 0;

  const toMinutes = (t) => {
    const [h, m, s] = t.split(':').map(Number);
    return h * 60 + m;
  };

  let inMin = toMinutes(checkin);
  let outMin = toMinutes(checkout);

  if (outMin < inMin) outMin += 1440;

  const nightStart = 22 * 60;

  if (inMin >= nightStart) return parseFloat(((outMin - inMin) / 60).toFixed(2));
  if (outMin <= nightStart) return 0;

  const nightMinutes = outMin - nightStart;
  return parseFloat((nightMinutes / 60).toFixed(2));
}

// GET /api/phantichcong
router.get('/phantichcong', (req, res) => {
  const query = `
    SELECT u.id_user, u.name_user, u.role_user, ws.start_w, ws.end_w, a.check_in, a.check_out, a.work_date FROM user u LEFT JOIN work_schedule ws ON u.id_user = ws.user_id LEFT JOIN attendance a ON u.id_user = a.id_user ORDER BY u.id_user ASC, a.work_date DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn:', err);
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }

    const formatted = results.map(row => {
      const workHours = calculateHours(row.checkin, row.checkout);
      const nightHours = calculateNightHours(row.checkin, row.checkout);

      return {
        id_user: row.id_user,
        name_user: row.name_user,
        role_user: row.role_user,
        start_time: row.start_w,
        end_time: row.end_w,
        checkin_time: row.checkin,
        checkout_time: row.checkout,
        date_attendance: row.work_date,
        work_hours: workHours,
        night_hours: nightHours,
      };
    });

    res.json({ success: true, data: formatted });
  });
});

module.exports = router;
