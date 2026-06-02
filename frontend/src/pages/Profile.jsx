import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import MobileBottomNav from '../components/MobileBottomNav';
import API from '../services/api';
import { getAvatarStyle, getAvatarInitials } from '../services/avatarHelper';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Drawer,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CalendarMonthRounded as CalendarIcon,
  CloseRounded as CloseIcon,
  CollectionsRounded as PostsIcon,
  VerifiedRounded as VerifiedIcon,
  AutoAwesomeRounded as SparkIcon,
} from '@mui/icons-material';

const Profile = ({ themeMode, toggleTheme }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const fetchUserPosts = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await API.get('/posts', {
        params: {
          userId: user.id,
          limit: 100,
        },
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching profile posts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  const getJoinedDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  };

  const sidebarStats = {
    posts: posts.length,
    followers: user?.followersCount ?? '1.2k',
    following: user?.followingCount ?? 580,
  };

  return (
    <Box className="page-shell" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        themeMode={themeMode}
        toggleTheme={toggleTheme}
        searchQuery=""
        onSearchChange={() => {}}
        onMobileNavOpen={() => setMobileDrawerOpen(true)}
        onCreatePostClick={() => navigate('/')}
      />

      <Container
        maxWidth={false}
        sx={{
          flexGrow: 1,
          width: '100%',
          maxWidth: '1520px',
          mx: 'auto',
          px: { xs: 2, sm: 2.5, md: 3, xl: 4 },
          pt: { xs: 2, md: 3.5 },
          pb: { xs: 12, md: 6 },
        }}
      >
        <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="flex-start">
          <Grid item xs={12} md={4} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 104 }}>
              <Sidebar stats={sidebarStats} />
            </Box>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Card
                className="glass-card hover-scale fade-in-entry"
                sx={{
                  borderRadius: '30px',
                  overflow: 'hidden',
                  background: 'rgba(17, 24, 39, 0.86)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    minHeight: { xs: 220, md: 260 },
                    background:
                      'radial-gradient(circle at 18% 18%, rgba(103, 232, 249, 0.38), transparent 26%), radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.38), transparent 24%), radial-gradient(circle at 58% 78%, rgba(6, 182, 212, 0.24), transparent 24%), linear-gradient(135deg, rgba(3, 7, 18, 0.9) 0%, rgba(15, 23, 42, 0.72) 45%, rgba(17, 24, 39, 0.92) 100%)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 45%, rgba(2, 6, 23, 0.36) 100%)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 260,
                      height: 260,
                      borderRadius: '999px',
                      background: 'rgba(6, 182, 212, 0.10)',
                      filter: 'blur(60px)',
                      top: -40,
                      left: -30,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 320,
                      height: 320,
                      borderRadius: '999px',
                      background: 'rgba(139, 92, 246, 0.12)',
                      filter: 'blur(80px)',
                      bottom: -80,
                      right: -40,
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      left: { xs: 20, md: 28 },
                      bottom: { xs: -54, md: -58 },
                      zIndex: 2,
                    }}
                  >
                    <Avatar
                      src={user?.avatar}
                      alt={user?.username}
                      sx={{
                        width: { xs: 108, md: 124 },
                        height: { xs: 108, md: 124 },
                        border: '5px solid rgba(15, 23, 42, 0.98)',
                        boxShadow: '0 24px 40px rgba(2, 6, 23, 0.5)',
                        ...getAvatarStyle(user?.username),
                      }}
                    >
                      {getAvatarInitials(user?.username)}
                    </Avatar>
                  </Box>
                </Box>

                <CardContent sx={{ p: { xs: 2.2, md: 3.5 }, pt: { xs: 8.5, md: 9 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', lg: 'row' },
                      justifyContent: 'space-between',
                      gap: 3,
                    }}
                  >
                    <Box sx={{ maxWidth: 720 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                          {user?.username}
                        </Typography>
                        <Chip
                          icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                          label="Verified creator"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(6, 182, 212, 0.12)',
                            color: '#7dd3fc',
                            border: '1px solid rgba(6, 182, 212, 0.18)',
                            fontWeight: 800,
                          }}
                        />
                      </Box>

                      <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mt: 0.8 }}>
                        {user?.email}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'var(--text-primary)',
                          mt: 2,
                          lineHeight: 1.8,
                          maxWidth: 720,
                        }}
                      >
                        {user?.bio ||
                          'Designing clean, high-signal social experiences and sharing product lessons, engineering wins, and creative experiments.'}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8,
                          color: 'var(--text-secondary)',
                          mt: 2.2,
                          flexWrap: 'wrap',
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 18 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Joined {getJoinedDate(user?.createdAt)}
                        </Typography>
                        <Chip
                          icon={<SparkIcon sx={{ fontSize: 16 }} />}
                          label="Sharing ideas daily"
                          size="small"
                          sx={{
                            ml: { xs: 0, sm: 1 },
                            bgcolor: 'rgba(255, 255, 255, 0.04)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        minWidth: { lg: 360 },
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 1.2,
                        alignSelf: { lg: 'center' },
                      }}
                    >
                      {[
                        { label: 'Posts', value: posts.length },
                        { label: 'Followers', value: user?.followersCount ?? '1.2k' },
                        { label: 'Following', value: user?.followingCount ?? 580 },
                      ].map((item) => (
                        <Box
                          key={item.label}
                          sx={{
                            p: 1.6,
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h5" sx={{ fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.05 }}>
                            {item.value}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                            {item.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PostsIcon sx={{ color: 'var(--accent-color)' }} />
                  My Shared Vibes
                </Typography>
                <Button
                  className="premium-button"
                  onClick={() => navigate('/')}
                  sx={{ px: 2.4, py: 1.05 }}
                >
                  Back to feed
                </Button>
              </Box>

              {loading ? (
                <Loader count={2} />
              ) : posts.length > 0 ? (
                <Box>
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
                  ))}
                </Box>
              ) : (
                <Card
                  className="glass-card fade-in-entry"
                  sx={{
                    borderRadius: '28px',
                    p: { xs: 3, md: 5 },
                    textAlign: 'center',
                    background: 'rgba(17, 24, 39, 0.86)',
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 1, fontWeight: 800 }}>
                      No posts shared yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      Go back to the feed and create your first vibe.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '290px',
            background: 'rgba(3, 7, 18, 0.96)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 30px 80px rgba(2, 6, 23, 0.56)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            p: 2.25,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: 'var(--text-primary)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Sidebar stats={sidebarStats} />
      </Drawer>

      <MobileBottomNav />
    </Box>
  );
};

export default Profile;
