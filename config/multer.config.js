// multer.config.js
const multer = require('multer');

const storage = multer.memoryStorage(); // Use memoryStorage for direct upload to Supabase
const upload = multer({ storage });

module.exports = upload;
