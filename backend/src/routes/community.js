import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import CommunityPost from '../models/CommunityPost.js';

const router = express.Router();

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const { category, limit = 20, skip = 0 } = req.query;

    const query = category ? { category } : {};

    const posts = await CommunityPost.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('userId', 'name')
      .populate('replies.userId', 'name');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/posts', [
  protect,
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('content').trim().notEmpty(),
  body('category').isIn(['career', 'finance', 'housing', 'relationships', 'health', 'legal']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, anonymous } = req.body;

    const post = await CommunityPost.create({
      userId: req.user._id,
      title,
      content,
      category,
      anonymous: anonymous || false,
    });

    // Award XP for creating post
    req.user.xp += 10;
    req.user.calculateLevel();
    await req.user.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('userId', 'name');

    res.status(201).json({
      success: true,
      post: populatedPost,
      xpEarned: 10,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
router.put('/posts/:id', [
  protect,
  body('title').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
], async (req, res) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    post.updatedAt = Date.now();

    await post.save();

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/posts/:id', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Post deleted',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like post
router.post('/posts/:id/like', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const alreadyLiked = post.likedBy.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike
      post.likedBy = post.likedBy.filter(id => id.toString() !== req.user._id.toString());
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      post.likedBy.push(req.user._id);
      post.likes += 1;
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add reply
router.post('/posts/:id/replies', [
  protect,
  body('content').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.replies.push({
      userId: req.user._id,
      content: req.body.content,
    });

    await post.save();

    // Award XP for replying
    req.user.xp += 5;
    req.user.calculateLevel();
    await req.user.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('userId', 'name')
      .populate('replies.userId', 'name');

    res.json({
      success: true,
      post: populatedPost,
      xpEarned: 5,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like reply
router.post('/posts/:postId/replies/:replyId/like', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reply = post.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const alreadyLiked = reply.likedBy.includes(req.user._id);

    if (alreadyLiked) {
      reply.likedBy = reply.likedBy.filter(id => id.toString() !== req.user._id.toString());
      reply.likes = Math.max(0, reply.likes - 1);
    } else {
      reply.likedBy.push(req.user._id);
      reply.likes += 1;
    }

    await post.save();

    res.json({
      success: true,
      likes: reply.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
