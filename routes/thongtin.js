const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy thông tin 1 nhân viên theo id_user
router.get('/:id_user', (req, res) => {
    const id_user = req.params.id_user;
    const sql = `
      SELECT 
        e.*, 
        u.name_user, 
        u.role_user
      FROM employee e
      LEFT JOIN user u ON e.id_user = u.id_user
      WHERE e.id_user = ?
    `;
  
    db.query(sql, [id_user], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
      res.json(results[0]);
    });
  });

  module.exports = router;