import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from '@mui/material';
import { SendRounded as SendIcon } from '@mui/icons-material';

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getCommenterAvatar = (username) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`;
  };

  const formatCommentTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const response = await API.post(`/posts/${postId}/comment`, { text: commentText });
      setCommentText('');
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert(error.response?.data?.message || 'Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 2.5, background: 'rgba(255, 255, 255, 0.02)' }}>
      {comments && comments.length > 0 ? (
        <List sx={{ mb: 2, maxHeight: 280, overflowY: 'auto', pr: 1 }}>
          {comments.map((comment, index) => (
            <ListItem
              key={comment._id || index}
              alignItems="flex-start"
              sx={{
                px: 1.5,
                py: 1.25,
                mb: 1.2,
                borderRadius: '18px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <ListItemAvatar sx={{ minWidth: 48 }}>
                <Avatar src={getCommenterAvatar(comment.username)} alt={comment.username} sx={{ width: 34, height: 34 }} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                      {comment.username}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatCommentTime(comment.createdAt)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-primary)',
                      mt: 0.7,
                      fontSize: '0.86rem',
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                    }}
                  >
                    {comment.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', textAlign: 'center', my: 2, fontSize: '0.86rem' }}>
          No comments yet. Start the conversation!
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmitComment} sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
        <Avatar
          src={getCommenterAvatar(user?.username || '')}
          alt={user?.username}
          sx={{
            width: 34,
            height: 34,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        />
        <TextField
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          disabled={submitting}
          InputProps={{
            className: 'glass-input',
            sx: {
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              borderRadius: '999px',
              '& fieldset': { border: 'none' },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting || !commentText.trim()}
          className="premium-button"
          sx={{
            minWidth: 44,
            width: 44,
            height: 44,
            borderRadius: '999px',
            p: 0,
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default CommentSection;
