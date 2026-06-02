import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { getAvatarStyle, getAvatarInitials } from '../services/avatarHelper';
import {
  Card,
  CardContent,
  Avatar,
  Box,
  InputBase,
  IconButton,
  Button,
  Popover,
  Grid,
  Typography,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Image as ImageIcon,
  EmojiEmotionsRounded as EmojiIcon,
  CancelRounded as CancelIcon,
  SendRounded as SendIcon,
  BoltRounded as BoltIcon,
} from '@mui/icons-material';

const POPULAR_EMOJIS = ['😊', '😂', '❤️', '🔥', '👍', '🎉', '🙌', '🚀', '✨', '👀', '💡', '💻'];

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => `${prev}${emoji}`);
    setEmojiAnchor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await API.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setText('');
      handleRemoveImage();

      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert(error.response?.data?.message || 'Something went wrong while publishing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      id="create-post-composer"
      className="glass-card hover-scale fade-in-entry"
      sx={{
        borderRadius: '28px',
        mb: 3,
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, rgba(17, 24, 39, 0.94) 0%, rgba(15, 23, 42, 0.86) 100%)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar
              src={user?.avatar}
              alt={user?.username}
              sx={{
                width: 52,
                height: 52,
                flexShrink: 0,
                boxShadow: '0 16px 30px rgba(2, 6, 23, 0.35)',
                border: '2px solid rgba(255, 255, 255, 0.12)',
                ...getAvatarStyle(user?.username),
              }}
            >
              {getAvatarInitials(user?.username)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15 }}>
                    Share something inspiring
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.4 }}>
                    Turn an idea, update, or win into a polished post.
                  </Typography>
                </Box>
                <Chip
                  icon={<BoltIcon sx={{ fontSize: 16 }} />}
                  label="Live composer"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(6, 182, 212, 0.12)',
                    color: '#7dd3fc',
                    border: '1px solid rgba(6, 182, 212, 0.18)',
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <InputBase
                  multiline
                  minRows={5}
                  placeholder="What's happening today?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  sx={{
                    width: '100%',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 500,
                    lineHeight: 1.7,
                    alignItems: 'flex-start',
                    '& .MuiInputBase-input': {
                      minHeight: 140,
                      '&::placeholder': {
                        color: 'var(--text-secondary)',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {imagePreview && (
            <Box
              sx={{
                position: 'relative',
                mt: 2,
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#020617',
                boxShadow: '0 20px 50px rgba(2, 6, 23, 0.35)',
              }}
            >
              <img
                src={imagePreview}
                alt="Selected attachment preview"
                style={{
                  width: '100%',
                  maxHeight: '360px',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(2, 6, 23, 0.36) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  color: '#fff',
                  bgcolor: 'rgba(2, 6, 23, 0.72)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  '&:hover': { bgcolor: 'rgba(2, 6, 23, 0.88)' },
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mt: 2.2,
              pt: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />

              <Tooltip title="Add image">
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    color: 'var(--text-primary)',
                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    '&:hover': {
                      bgcolor: 'rgba(6, 182, 212, 0.12)',
                      color: '#7dd3fc',
                    },
                  }}
                >
                  <ImageIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add emoji">
                <IconButton
                  onClick={(e) => setEmojiAnchor(e.currentTarget)}
                  sx={{
                    color: 'var(--text-primary)',
                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    '&:hover': {
                      bgcolor: 'rgba(139, 92, 246, 0.14)',
                      color: '#c4b5fd',
                    },
                  }}
                >
                  <EmojiIcon />
                </IconButton>
              </Tooltip>

              <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: { xs: 'none', md: 'block' } }}>
                Images, updates, and celebrations all belong here.
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={loading || (!text.trim() && !imageFile)}
              endIcon={<SendIcon />}
              className="premium-button"
              sx={{
                px: 3,
                py: 1.25,
                minWidth: { xs: '100%', sm: 170 },
                boxShadow: '0 16px 40px rgba(6, 182, 212, 0.24)',
              }}
            >
              {loading ? 'Publishing...' : 'Post now'}
            </Button>
          </Box>
        </form>

        <Popover
          open={Boolean(emojiAnchor)}
          anchorEl={emojiAnchor}
          onClose={() => setEmojiAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              mt: 1.2,
              p: 1.5,
              width: 248,
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.94)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 60px rgba(2, 6, 23, 0.45)',
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, mb: 1.25, color: 'var(--text-primary)', textAlign: 'center' }}
          >
            Pick an emoji
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            {POPULAR_EMOJIS.map((emoji) => (
              <Grid item key={emoji}>
                <IconButton
                  onClick={() => handleEmojiClick(emoji)}
                  sx={{
                    fontSize: '1.3rem',
                    width: 40,
                    height: 40,
                    borderRadius: '14px',
                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                  }}
                >
                  {emoji}
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
