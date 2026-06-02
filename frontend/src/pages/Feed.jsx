import { Fragment, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import MobileBottomNav from '../components/MobileBottomNav';
import API from '../services/api';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  Avatar,
  Button,
  Drawer,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  TrendingUpRounded as TrendingIcon,
  GroupRounded as GroupIcon,
  CloseRounded as CloseIcon,
  PublicRounded as PublicIcon,
} from '@mui/icons-material';

const Feed = ({ themeMode, toggleTheme }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const suggestedUsers = [
    { name: 'Aditya Sharma', handle: '@aditya_codes', role: 'Frontend Engineer', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aditya&backgroundType=gradientLinear' },
    { name: 'Neha Patel', handle: '@neha_designer', role: 'UI Designer', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Neha&backgroundType=gradientLinear' },
    { name: 'Rohan Gupta', handle: '@rohan_dev', role: 'Full Stack Developer', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rohan&backgroundType=gradientLinear' },
  ];

  const trendingTags = [
    { tag: 'MERNStack', postsCount: '1.2k posts', tone: 'hot' },
    { tag: 'FullStackInternship', postsCount: '840 posts', tone: 'rising' },
    { tag: 'ReactJS', postsCount: '2.5k posts', tone: 'hot' },
    { tag: 'WebDesign', postsCount: '630 posts', tone: 'fresh' },
    { tag: 'VibeConnect', postsCount: '450 posts', tone: 'fresh' },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchPosts = useCallback(async (pageNum, searchQueryStr, replace = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await API.get('/posts', {
        params: {
          page: pageNum,
          limit: 5,
          search: searchQueryStr,
        },
      });

      const { posts: newPosts, pages: fetchedTotalPages } = response.data;

      setPosts((prev) => (replace ? newPosts : [...prev, ...newPosts]));
      setTotalPages(fetchedTotalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, debouncedSearch, true);
  }, [debouncedSearch, fetchPosts]);

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, debouncedSearch, false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  const sidebarStats = {
    posts: user?.postsCount ?? 24,
    followers: user?.followersCount ?? '1.2k',
    following: user?.followingCount ?? 580,
  };

  const openComposer = () => {
    const composer = document.getElementById('create-post-composer');
    if (composer) {
      composer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box className="page-shell" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        themeMode={themeMode}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onMobileNavOpen={() => setMobileDrawerOpen(true)}
        onCreatePostClick={openComposer}
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

          <Grid item xs={12} md={8} lg={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                    Home Feed
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.6 }}>
                    Discover ideas, updates, and conversations from the VibeConnect community.
                  </Typography>
                </Box>
                <Chip
                  icon={<PublicIcon sx={{ fontSize: 16 }} />}
                  label="Community live"
                  sx={{
                    bgcolor: 'rgba(6, 182, 212, 0.12)',
                    color: '#7dd3fc',
                    border: '1px solid rgba(6, 182, 212, 0.18)',
                    fontWeight: 700,
                  }}
                />
              </Box>

              <CreatePost onPostCreated={handlePostCreated} />

              {loading ? (
                <Loader count={2} />
              ) : posts.length > 0 ? (
                <Box>
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
                  ))}

                  {page < totalPages && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        sx={{
                          borderRadius: '999px',
                          px: 3.5,
                          py: 1.15,
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: 'rgba(255, 255, 255, 0.14)',
                          color: 'var(--text-primary)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          backdropFilter: 'blur(16px)',
                          '&:hover': {
                            borderColor: 'rgba(6, 182, 212, 0.45)',
                            background: 'rgba(6, 182, 212, 0.08)',
                          },
                        }}
                      >
                        {loadingMore ? 'Loading more vibes...' : 'Load more posts'}
                      </Button>
                    </Box>
                  )}
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
                      No posts found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      {debouncedSearch
                        ? `No matches for "${debouncedSearch}". Try another search term.`
                        : 'Be the first to share your thoughts with the community!'}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4} lg={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 104, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Card
                className="glass-card hover-scale"
                sx={{
                  borderRadius: '26px',
                  background: 'rgba(17, 24, 39, 0.86)',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 800, color: 'var(--text-primary)', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <TrendingIcon sx={{ color: 'var(--accent-color)' }} />
                    Trending Vibes
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                    {trendingTags.map((tag) => (
                      <Box
                        key={tag.tag}
                        onClick={() => setSearchQuery(`#${tag.tag}`)}
                        sx={{
                          cursor: 'pointer',
                          p: 1.4,
                          borderRadius: '18px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          transition: 'all 180ms ease',
                          '&:hover': {
                            background: 'rgba(6, 182, 212, 0.08)',
                            borderColor: 'rgba(6, 182, 212, 0.18)',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                            #{tag.tag}
                          </Typography>
                          <Chip
                            label={tag.tone}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.7rem',
                              textTransform: 'uppercase',
                              fontWeight: 800,
                              bgcolor:
                                tag.tone === 'hot'
                                  ? 'rgba(251, 113, 133, 0.12)'
                                  : tag.tone === 'rising'
                                    ? 'rgba(139, 92, 246, 0.12)'
                                    : 'rgba(6, 182, 212, 0.12)',
                              color:
                                tag.tone === 'hot'
                                  ? '#fda4af'
                                  : tag.tone === 'rising'
                                    ? '#d8b4fe'
                                    : '#7dd3fc',
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                          {tag.postsCount}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              <Card
                className="glass-card hover-scale"
                sx={{
                  borderRadius: '26px',
                  background: 'rgba(17, 24, 39, 0.86)',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 800, color: 'var(--text-primary)', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <GroupIcon sx={{ color: 'var(--accent-color)' }} />
                    Suggested Creators
                  </Typography>
                  <List disablePadding>
                    {suggestedUsers.map((item, index) => (
                      <Fragment key={item.handle}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1.1,
                            gap: 1.25,
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 1.3, alignItems: 'center', minWidth: 0 }}>
                            <Avatar
                              src={item.avatar}
                              alt={item.name}
                              sx={{
                                width: 42,
                                height: 42,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" noWrap sx={{ color: 'var(--text-secondary)' }}>
                                {item.handle} · {item.role}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            variant="text"
                            size="small"
                            sx={{
                              textTransform: 'none',
                              color: 'var(--accent-color)',
                              fontWeight: 800,
                              borderRadius: '999px',
                              px: 1.4,
                              '&:hover': { background: 'rgba(6, 182, 212, 0.08)' },
                            }}
                          >
                            Follow
                          </Button>
                        </Box>
                        {index < suggestedUsers.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />}
                      </Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>

              <Card
                className="glass-card hover-scale"
                sx={{
                  borderRadius: '26px',
                  background:
                    'radial-gradient(circle at top left, rgba(6, 182, 212, 0.16), transparent 36%), radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.14), transparent 36%), rgba(17, 24, 39, 0.86)',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--text-primary)', mb: 1 }}>
                    Community Pulse
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                    Stay close to the conversations shaping the VibeConnect feed today.
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: 1.2,
                    }}
                  >
                    {[
                      { label: 'Daily posts', value: '1.8k' },
                      { label: 'Active creators', value: '320' },
                      { label: 'New follows', value: '96' },
                      { label: 'Comments', value: '4.4k' },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          p: 1.4,
                          borderRadius: '18px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                          {item.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    className="premium-button"
                    sx={{ mt: 2.2, width: '100%', py: 1.15 }}
                    onClick={openComposer}
                  >
                    Start a post
                  </Button>
                </CardContent>
              </Card>
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

export default Feed;
