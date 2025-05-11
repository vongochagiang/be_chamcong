// server/config/db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'mysql-363ba6c9-hagiang1753.b.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_hAM8uZHUS0Z5xQk0gum',
  database: 'defaultdb',
  // port:3306,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err);
  } else {
    console.log('✅ Kết nối MySQL thành công');
  }
});

module.exports = db;
