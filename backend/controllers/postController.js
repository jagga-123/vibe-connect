const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post (text only, image only, or both)
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let image = '';

    if (req.file) {
      // Store relative path to the uploaded image file
      image = `/uploads/${req.file.filename}`;
    }

    if (!text && !image) {
      return res.status(400).json({ message: 'Post must contain at least text or an image.' });
    }

    const newPost = new Post({
      user: req.user.id,
      text: text || '',
      image,
      likes: [],
      comments: []
    });

    await newPost.save();

    // Populate user profile info to render instantly on UI
    const populatedPost = await Post.findById(newPost._id).populate('user', 'username avatar');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error while creating post.' });
  }
};

// Get feed posts (with pagination and search)
exports.getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', userId = '' } = req.query;
    const query = {};

    // Search filter
    if (search) {
      query.text = { $regex: search, $options: 'i' };
    }

    // Filter by specific user (for Profile page)
    if (userId) {
      query.user = userId;
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(query)
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skipIndex);

    const total = await Post.countDocuments(query);

    res.status(200).json({
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error fetching feed.' });
  }
};

// Like or Unlike a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if user already liked the post
    const alreadyLikedIndex = post.likes.findIndex(
      (like) => like.userId.toString() === req.user.id
    );

    if (alreadyLikedIndex !== -1) {
      // User has already liked, so UNLIKE (remove from array)
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      // User has not liked, so LIKE (add user details)
      post.likes.push({
        userId: req.user.id,
        username: req.user.username
      });
    }

    await post.save();
    
    // Return updated likes array
    res.status(200).json(post.likes);
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error liking/unliking post.' });
  }
};

// Add a comment to a post
exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Create comment object
    const newComment = {
      userId: req.user.id,
      username: req.user.username,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Return the updated comments list
    res.status(201).json(post.comments);
  } catch (error) {
    console.error('Comment post error:', error);
    res.status(500).json({ message: 'Server error adding comment.' });
  }
};
