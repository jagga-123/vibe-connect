import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API, { API_BASE_URL } from '../services/api';
import CommentSection from './CommentSection';
import { getAvatarStyle, getAvatarInitials } from '../services/avatarHelper';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Collapse,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  ShareOutlined as ShareIcon,
  MoreHorizRounded as MoreIcon,
  AccessTimeRounded as TimeIcon,
} from '@mui/icons-material';

const getBackendOrigin = () => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch (error) {
    console.error('Invalid API_BASE_URL:', error);
    return '';
  }
};

const BACKEND_BASE = getBackendOrigin();

const PostCard = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isLiked = likes.some((like) => like.userId === user?.id);

  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${BACKEND_BASE}${img}`;
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleLike = async () => {
    const updatedLikes = [...likes];
    const userLikeIndex = updatedLikes.findIndex((l) => l.userId === user.id);

    if (userLikeIndex !== -1) {
      updatedLikes.splice(userLikeIndex, 1);
      setLikeAnimating(false);
    } else {
      updatedLikes.push({ userId: user.id, username: user.username });
      setLikeAnimating(true);
    }
    setLikes(updatedLikes);

    try {
      const response = await API.put(`/posts/${post._id}/like`);
      setLikes(response.data);
    } catch (error) {
      console.error('Failed to like post:', error);
      setLikes(post.likes);
    }
  };

  const handleCommentAdded = (updatedComments) => {
    setComments(updatedComments);
    if (onPostUpdated) {
      onPostUpdated({ ...post, comments: updatedComments });
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      alert('Post share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <Card
      className="glass-card hover-scale fade-in-entry"
      sx={{
        borderRadius: '28px',
        mb: 2.5,
        overflow: 'hidden',
        background: 'rgba(17, 24, 39, 0.86)',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          pt: 2.5,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', minWidth: 0 }}>
          <Avatar
            src={post.user?.avatar}
            alt={post.user?.username}
            sx={{
              width: 50,
              height: 50,
              flexShrink: 0,
              border: '2px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 12px 24px rgba(2, 6, 23, 0.32)',
              ...getAvatarStyle(post.user?.username),
            }}
          >
            {getAvatarInitials(post.user?.username)}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                wordBreak: 'break-word',
              }}
            >
              {post.user?.username || 'Viber User'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.4, color: 'var(--text-secondary)' }}>
              <TimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
                {formatTime(post.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Tooltip title="More options">
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{
              color: 'var(--text-secondary)',
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-primary)' },
            }}
          >
            <MoreIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {post.text && (
        <CardContent sx={{ px: 2.5, pb: post.image ? 1.5 : 0.5, pt: 1.8 }}>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              fontSize: '0.99rem',
              lineHeight: 1.75,
              letterSpacing: '0.01em',
            }}
          >
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <Box
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 40px rgba(2, 6, 23, 0.3)',
              background: '#020617',
            }}
          >
            <img
              src={getImageUrl(post.image)}
              alt="Post attachment"
              style={{
                width: '100%',
                maxHeight: '520px',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          color: 'var(--text-secondary)',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {likes.length > 0 ? `${likes.length} like${likes.length === 1 ? '' : 's'}` : 'Be the first to like this'}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {comments.length > 0 ? `${comments.length} comment${comments.length === 1 ? '' : 's'}` : 'No comments yet'}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      <CardActions
        sx={{
          px: 1.5,
          py: 1.1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 1,
        }}
      >
        <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
          <IconButton
            onClick={handleLike}
            className="hover-scale"
            sx={{
              width: '100%',
              borderRadius: '18px',
              color: isLiked ? 'var(--like-color)' : 'var(--text-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              background: isLiked ? 'rgba(251, 113, 133, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              gap: 1,
              px: 1.5,
              py: 1.05,
              '&:hover': {
                bgcolor: isLiked ? 'rgba(251, 113, 133, 0.14)' : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            {isLiked ? (
              <FavoriteIcon className={likeAnimating ? 'like-pop' : ''} />
            ) : (
              <FavoriteBorderIcon />
            )}
            <Typography variant="button" sx={{ fontSize: '0.84rem', fontWeight: 700 }}>
              Like
            </Typography>
          </IconButton>
        </Tooltip>

        <Tooltip title="Comments">
          <IconButton
            onClick={() => setCommentsExpanded(!commentsExpanded)}
            className="hover-scale"
            sx={{
              width: '100%',
              borderRadius: '18px',
              color: commentsExpanded ? 'var(--comment-color)' : 'var(--text-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              background: commentsExpanded ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              gap: 1,
              px: 1.5,
              py: 1.05,
              '&:hover': {
                bgcolor: 'rgba(56, 189, 248, 0.12)',
              },
            }}
          >
            <CommentIcon />
            <Typography variant="button" sx={{ fontSize: '0.84rem', fontWeight: 700 }}>
              Comment
            </Typography>
          </IconButton>
        </Tooltip>

        <Tooltip title="Share">
          <IconButton
            onClick={handleShare}
            className="hover-scale"
            sx={{
              width: '100%',
              borderRadius: '18px',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(255, 255, 255, 0.03)',
              gap: 1,
              px: 1.5,
              py: 1.05,
              '&:hover': {
                bgcolor: 'rgba(6, 182, 212, 0.1)',
                color: 'var(--accent-color)',
              },
            }}
          >
            <ShareIcon />
            <Typography variant="button" sx={{ fontSize: '0.84rem', fontWeight: 700 }}>
              Share
            </Typography>
          </IconButton>
        </Tooltip>
      </CardActions>

      <Collapse in={commentsExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <CommentSection postId={post._id} comments={comments} onCommentAdded={handleCommentAdded} />
        </Box>
      </Collapse>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            background: 'rgba(15, 23, 42, 0.96)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 60px rgba(2, 6, 23, 0.45)',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            handleShare();
          }}
        >
          Copy link
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            alert('Post saved to your collection.');
          }}
        >
          Save post
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default PostCard;
