const express = require('express');
const multer = require('multer');
const { supabase } = require('../config/supabase.config');
const authMiddleware = require('../middlewares/auth')
const fileModel = require('../models/file.model')

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();



router.get('/home', authMiddleware, async (req, res) => {

  const userFiles = await fileModel.find({
    user: req.user.userId
  })

  res.render('home', {
    files: userFiles
  });
})

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file selected');

    const fileName = `file-${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from('gtmdrive')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).send(error.message);
    }

    // Save file metadata to MongoDB - with all required fields
    const fileDoc = new fileModel({
      path: fileName, // Required path field
      originalName: req.file.originalname, // Required originalName field
      user: req.user.userId // Required user reference (from authMiddleware)
    });

    await fileDoc.save();

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileId: fileDoc._id
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Upload failed');
  }
});


router.get('/download/:path', authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const path = decodeURIComponent(req.params.path);

    const file = await fileModel.findOne({
      user: loggedInUserId,
      path: path
    });

    if (!file) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .storage
      .from('gtmdrive')
      .createSignedUrl(file.path.replace('gtmdrive/', ''), 60); // 60 seconds

    if (error || !data) {
      console.error('Supabase signed URL error:', error);
      return res.status(500).json({ message: 'Failed to get signed URL' });
    }

    return res.redirect(data.signedUrl);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});








module.exports = router;