import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import coachRoutes from './routes/coach.js';
import userRoutes from './routes/user.js';
import simulationRoutes from './routes/simulations.js';
import documentRoutes from './routes/documents.js';
import communityRoutes from './routes/community.js';
import coursesRoutes from './routes/courses.js';
import roadmapRoutes from './routes/roadmap.js';
import personalizationRoutes from './routes/personalization.js';

dotenv.config();

// Connect to Database (hybrid: PostgreSQL + Local Storage)
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/user', userRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/personalization', personalizationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AdultIQ AI Platform is running',
    timestamp: new Date().toISOString(),
    features: {
      rag: !!process.env.NVIDIA_API_KEY, // RAG depends on NVIDIA now
      personalization: true,
      vectorDB: !!process.env.POSTGRES_HOST,
      aiModels: {
        nvidia: !!process.env.NVIDIA_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        anthropic: !!process.env.ANTHROPIC_API_KEY
      }
    }
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'AdultIQ AI Platform API',
    version: '2.0.0',
    description: 'Production-ready AI platform with RAG and personalization',
    features: [
      'RAG-powered document analysis',
      'Context-aware AI life coach',
      'Personalized recommendations',
      'Behavior tracking and analytics',
      'AdultIQ score calculation',
      'Adaptive simulations'
    ],
    endpoints: {
      auth: '/api/auth',
      coach: '/api/coach',
      documents: '/api/documents',
      personalization: '/api/personalization',
      user: '/api/user',
      courses: '/api/courses',
      simulations: '/api/simulations',
      community: '/api/community',
      roadmap: '/api/roadmap'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableEndpoints: [
      '/api',
      '/health',
      '/api/auth',
      '/api/coach',
      '/api/documents',
      '/api/personalization'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AdultIQ AI Platform running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`🤖 Features enabled:`);
  console.log(`   - RAG: ${process.env.NVIDIA_API_KEY ? '✅' : '❌'}`);
  console.log(`   - Personalization: ✅`);
  console.log(`   - Vector DB: ${process.env.POSTGRES_HOST ? '✅' : '❌'}`);
  console.log(`   - AI Models: NVIDIA ${process.env.NVIDIA_API_KEY ? '✅' : '❌'} | OpenAI ${process.env.OPENAI_API_KEY ? '✅' : '❌'} | Anthropic ${process.env.ANTHROPIC_API_KEY ? '✅' : '❌'}`);
});

export default app;