const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM user WHERE email_user = ? AND password_user = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      const user = results[0];
      // Don't send password in response
      const { password_user, ...userWithoutPassword } = user;
      res.json({ 
        success: true, 
        user: { 
          id_user: user.id_user,
          name_user: user.name_user,
          email: user.email_user,
          role_user: user.role_user
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});

router.get('/me', async (req, res) => {
  const id_user = req.query.id_user;
  if (!id_user) {
    return res.status(400).json({ success: false, message: 'Thiếu id_user!' });
  }
  try {
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
