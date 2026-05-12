import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'viva-tech-secret-key-2026';
const db = new Database('database.sqlite');

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
  }
});

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    title TEXT,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(uploadDir));

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Register
  app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, mobile, username, password } = req.body;
    try {
      const userCount: any = db.prepare('SELECT COUNT(*) as count FROM users').get();
      const role = userCount.count === 0 ? 'admin' : 'user';
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (full_name, email, mobile, username, password, role) VALUES (?, ?, ?, ?, ?, ?)');
      const result = stmt.run(fullName, email, mobile, username, hashedPassword, role);
      
      db.prepare('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)').run(result.lastInsertRowid, 'registration');
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ message: 'Username or Email already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
      const user: any = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(identifier, identifier);
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Administrative privileges required' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role, fullName: user.full_name }, JWT_SECRET, { expiresIn: '24h' });
      
      db.prepare('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)').run(user.id, 'login');
      
      res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
      res.json({ user: { id: user.id, username: user.username, role: user.role, fullName: user.full_name } });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Profile
  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const user: any = db.prepare('SELECT id, full_name, email, mobile, username, role, avatar_url, created_at FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  });

  // Activity Logs
  app.get('/api/auth/logs', authenticateToken, (req: any, res) => {
    try {
      const logs = db.prepare('SELECT id, action, details, created_at FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(req.user.id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch logs' });
    }
  });

  // Upload Profile Photo
  app.post('/api/auth/upload', authenticateToken, upload.single('photo'), (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const avatarUrl = `/uploads/${req.file.filename}`;
      db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(avatarUrl, req.user.id);
      
      db.prepare('INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)').run(req.user.id, 'photo_upload', 'Updated profile photo');
      
      res.json({ avatarUrl, message: 'Profile photo updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload photo' });
    }
  });

  // Update Profile
  app.patch('/api/auth/profile', authenticateToken, (req: any, res) => {
    const { fullName, email, mobile, username, avatarUrl } = req.body;
    try {
      const stmt = db.prepare('UPDATE users SET full_name = ?, email = ?, mobile = ?, username = ?, avatar_url = ? WHERE id = ?');
      stmt.run(fullName, email, mobile, username, avatarUrl, req.user.id);
      
      db.prepare('INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)').run(req.user.id, 'profile_update', 'Updated user information');
      
      res.json({ message: 'Profile updated successfully' });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ message: 'Username or Email already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  // Update Password
  app.patch('/api/auth/password', authenticateToken, async (req: any, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
      const user: any = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
      
      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(400).json({ message: 'Invalid current password' });
      }

      const hash = await bcrypt.hash(newPassword, 10);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, req.user.id);
      
      db.prepare('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)').run(req.user.id, 'password_change');
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Delete Account
  app.delete('/api/auth/profile', authenticateToken, (req: any, res) => {
    try {
      db.prepare('DELETE FROM activity_logs WHERE user_id = ?').run(req.user.id);
      db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
      res.clearCookie('token');
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete account' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  // Admin: Get Users
  app.get('/api/admin/users', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const users = db.prepare('SELECT id, full_name, email, role, created_at FROM users').all();
    res.json(users);
  });

  // --- Blog Management ---
  app.get('/api/blogs', (req, res) => {
    const blogs = db.prepare('SELECT * FROM blogs ORDER BY publish_date DESC').all();
    res.json(blogs);
  });

  app.post('/api/blogs', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { title, description, category, image_url, publish_date } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO blogs (title, description, category, image_url, publish_date) VALUES (?, ?, ?, ?, ?)');
      const result = stmt.run(title, description, category, image_url, publish_date || new Date().toISOString());
      res.status(201).json({ id: result.lastInsertRowid, message: 'Blog created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create blog' });
    }
  });

  app.patch('/api/blogs/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { title, description, category, image_url, publish_date } = req.body;
    try {
      const stmt = db.prepare('UPDATE blogs SET title = ?, description = ?, category = ?, image_url = ?, publish_date = ? WHERE id = ?');
      stmt.run(title, description, category, image_url, publish_date, req.params.id);
      res.json({ message: 'Blog updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update blog' });
    }
  });

  app.delete('/api/blogs/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
      db.prepare('DELETE FROM blogs WHERE id = ?').run(req.params.id);
      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete blog' });
    }
  });

  // --- Gallery Management ---
  app.get('/api/gallery', (req, res) => {
    const gallery = db.prepare('SELECT * FROM gallery ORDER BY created_at DESC').all();
    res.json(gallery);
  });

  app.post('/api/gallery', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { image_url, title, caption } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO gallery (image_url, title, caption) VALUES (?, ?, ?)');
      const result = stmt.run(image_url, title, caption);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Gallery item added' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add to gallery' });
    }
  });

  app.patch('/api/gallery/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { title, caption } = req.body;
    try {
      db.prepare('UPDATE gallery SET title = ?, caption = ? WHERE id = ?').run(title, caption, req.params.id);
      res.json({ message: 'Gallery item updated' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update gallery item' });
    }
  });

  app.delete('/api/gallery/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
      db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
      res.json({ message: 'Gallery item removed' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove gallery item' });
    }
  });

  // General Image Upload Endpoint
  app.post('/api/upload', authenticateToken, upload.single('image'), (req: any, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // Delete User by Admin
  app.delete('/api/admin/users/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
      const userId = req.params.id;
      // Prevent admin from deleting themselves through this endpoint to avoid accidental lockout
      if (userId == req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account via user management' });
      }
      db.prepare('DELETE FROM activity_logs WHERE user_id = ?').run(userId);
      db.prepare('DELETE FROM users WHERE id = ?').run(userId);
      res.json({ message: 'User profile purged successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to purge user' });
    }
  });

  // Vite setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
