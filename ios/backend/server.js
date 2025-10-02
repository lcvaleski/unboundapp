require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit for Whisper API
  },
  fileFilter: (req, file, cb) => {
    // Supported formats: mp3, mp4, mpeg, mpga, m4a, wav, webm
    const allowedMimes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/mp4',
      'audio/m4a',
      'audio/wav',
      'audio/webm',
      'audio/x-m4a',
      'video/mp4', // mp4 audio track
      'video/webm', // webm audio track
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Supported formats: mp3, mp4, m4a, wav, webm'));
    }
  },
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Transcription endpoint
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Received audio file:', req.file);

    // OpenAI SDK expects a file with proper extension
    // Copy the file with proper extension
    const newPath = req.file.path + '.m4a';
    fs.copyFileSync(req.file.path, newPath);

    // Create read stream with the new path
    const audioFile = fs.createReadStream(newPath);

    // Send to OpenAI Whisper API
    // Note: whisper-1 uses the turbo model by default (optimized for speed)
    // For translation tasks, use tiny, base, small, medium, or large instead
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1', // This defaults to the turbo model
      language: 'en', // Optional: specify language for better accuracy
      // response_format: 'json', // Optional: json (default), text, srt, verbose_json, or vtt
      // prompt: 'Optional context to guide the transcription', // Optional: provide context
      // temperature: 0, // Optional: sampling temperature between 0 and 1
    });

    // Clean up both files
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(newPath);

    console.log('Transcription successful:', transcription.text);

    // Return the transcription
    res.json({
      success: true,
      text: transcription.text,
    });
  } catch (error) {
    console.error('Transcription error:', error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Transcription failed',
      message: error.message,
    });
  }
});

// Translation endpoint (translates to English)
app.post('/translate', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Received audio file for translation:', req.file);

    // Read the audio file
    const audioFile = fs.createReadStream(req.file.path);

    // Send to OpenAI Whisper API for translation
    // Note: For translation, avoid the turbo model - use tiny, base, small, medium, or large
    const translation = await openai.audio.translations.create({
      file: audioFile,
      model: 'whisper-1', // Will use appropriate model for translation
    });

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    console.log('Translation successful:', translation.text);

    // Return the translation
    res.json({
      success: true,
      text: translation.text,
    });
  } catch (error) {
    console.error('Translation error:', error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Translation failed',
      message: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Ready to transcribe and translate audio files!');
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST /transcribe - Transcribe audio in any language');
  console.log('  POST /translate  - Translate audio to English');
  console.log('  GET  /health     - Health check');
  console.log('');

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not found in environment variables');
    console.warn('⚠️  Please create a .env file with your OpenAI API key');
  } else {
    console.log('✅ OpenAI API key found');
  }
});