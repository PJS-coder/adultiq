import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Achievement from '../models/Achievement.js';
import CourseCompletion from '../models/Course.js';

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        adultIqScore: user.adultIqScore,
        quizCompleted: user.quizCompleted,
        level: user.level,
        xp: user.xp,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (name) req.user.name = name;
    if (email) req.user.email = email;

    await req.user.save();

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        adultIqScore: req.user.adultIqScore,
        quizCompleted: req.user.quizCompleted,
        level: req.user.level,
        xp: req.user.xp,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz results
router.post('/quiz', protect, async (req, res) => {
  try {
    const { answers, score } = req.body;

    req.user.quizCompleted = true;
    req.user.adultIqScore = score;
    req.user.quizAnswers = answers;
    req.user.xp += 50; // Bonus XP for completing quiz
    req.user.calculateLevel();
    await req.user.save();

    // Award "First Steps" achievement
    try {
      await Achievement.create({
        userId: req.user.id,
        badgeName: 'First Steps',
        badgeType: 'first-steps',
        description: 'Complete your first quiz',
      });
    } catch (err) {
      // Achievement might already exist
      console.log('Achievement already exists or error:', err.message);
    }

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        adultIqScore: req.user.adultIqScore,
        quizCompleted: req.user.quizCompleted,
        level: req.user.level,
        xp: req.user.xp,
      },
      xpEarned: 50,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user progress/milestones
router.get('/progress', protect, async (req, res) => {
  try {
    const progress = await Progress.findByUserId(req.user.id);

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update milestone progress
router.post('/progress', protect, async (req, res) => {
  try {
    const { milestoneId, milestoneType, milestoneName, completed } = req.body;

    let progress = await Progress.findByUserAndMilestone(req.user.id, milestoneId);

    if (progress) {
      progress.completed = completed;
      if (completed) {
        progress.completedAt = new Date().toISOString();
        // Award XP for completing milestone
        req.user.xp += 20;
        req.user.calculateLevel();
        await req.user.save();
      }
      await progress.save();
    } else {
      progress = await Progress.create({
        userId: req.user.id,
        milestoneId,
        milestoneType,
        milestoneName,
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      });

      if (completed) {
        req.user.xp += 20;
        req.user.calculateLevel();
        await req.user.save();
      }
    }

    res.json({
      success: true,
      progress,
      xpEarned: completed ? 20 : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user achievements
router.get('/achievements', protect, async (req, res) => {
  try {
    const achievements = await Achievement.findByUserId(req.user.id);

    res.json({
      success: true,
      achievements,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Award achievement
router.post('/achievements', protect, async (req, res) => {
  try {
    const { badgeName, badgeType, description } = req.body;

    const achievement = await Achievement.create({
      userId: req.user.id,
      badgeName,
      badgeType,
      description,
    });

    // Award XP for achievement
    req.user.xp += 30;
    req.user.calculateLevel();
    await req.user.save();

    res.json({
      success: true,
      achievement,
      xpEarned: 30,
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: 'Achievement already earned' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get completed courses
router.get('/courses', protect, async (req, res) => {
  try {
    const courses = await CourseCompletion.findByUserId(req.user.id);

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete a course
router.post('/courses', protect, async (req, res) => {
  try {
    const { courseId, courseName } = req.body;

    const course = await CourseCompletion.create({
      userId: req.user.id,
      courseId,
      courseName,
    });

    // Award XP for completing course
    req.user.xp += 15;
    req.user.calculateLevel();
    await req.user.save();

    res.json({
      success: true,
      course,
      xpEarned: 15,
    });
  } catch (error) {
    if (error.message.includes('already completed')) {
      return res.status(400).json({ error: 'Course already completed' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get user stats
router.get('/stats', protect, async (req, res) => {
  try {
    const achievements = await Achievement.findByUserId(req.user.id);
    const progress = await Progress.findCompleted(req.user.id);
    const courses = await CourseCompletion.findByUserId(req.user.id);

    res.json({
      success: true,
      stats: {
        level: req.user.level,
        xp: req.user.xp,
        adultIqScore: req.user.adultIqScore,
        achievementsEarned: achievements.length,
        milestonesCompleted: progress.length,
        coursesCompleted: courses.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
