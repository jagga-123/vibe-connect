import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAvatarStyle, getAvatarInitials } from '../services/avatarHelper';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Box,
  Avatar,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  NotificationsNone as NotificationsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  AddRounded as AddIcon,
} from '@mui/icons-material';

const Navbar = ({
  themeMode,
  toggleTheme,
  searchQuery,
  onSearchChange,
  onMobileNavOpen,
  onCreatePostClick,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 14px 40px rgba(2, 6, 23, 0.28)',
        color: 'var(--text-primary)',
        zIndex: (theme) => theme.zIndex.drawer + 2,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: { xs: 76, md: 84 },
          px: { xs: 2, sm: 2.5, md: 4 },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 'fit-content' }}>
          <IconButton
            onClick={onMobileNavOpen}
            sx={{
              display: { md: 'none' },
              color: 'var(--text-primary)',
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <Typography
              variant="h5"
              onClick={() => navigate('/')}
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.04em',
                cursor: 'pointer',
                userSelect: 'none',
                lineHeight: 1,
              }}
            >
              <span className="gradient-text">VibeConnect</span>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'var(--text-secondary)',
                mt: 0.2,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Premium social workspace
            </Typography>
          </Box>
        </Box>

        <Box
          className="glass-input"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 1,
            flex: 1,
            maxWidth: { sm: 320, md: 520, lg: 620 },
            mx: { md: 1.5, lg: 3 },
            px: 2,
            py: 1,
            minHeight: 52,
            borderRadius: '999px !important',
            background: 'rgba(15, 23, 42, 0.92) !important',
          }}
        >
          <SearchIcon sx={{ color: 'var(--text-secondary)', fontSize: 20 }} />
          <InputBase
            placeholder="Search people, posts, hashtags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flex: 1,
              color: 'var(--text-primary)',
              fontSize: '0.96rem',
              fontWeight: 500,
              '& .MuiInputBase-input': {
                py: 0,
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'var(--text-secondary)',
                opacity: 1,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <Tooltip title="Create post">
            <Box>
              <Button
                onClick={onCreatePostClick}
                className="premium-button"
                startIcon={<AddIcon />}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  px: 2.2,
                  py: 1.15,
                  minHeight: 46,
                  boxShadow: '0 14px 30px rgba(6, 182, 212, 0.22)',
                }}
              >
                Create Post
              </Button>
              <IconButton
                onClick={onCreatePostClick}
                sx={{
                  display: { xs: 'inline-flex', sm: 'none' },
                  color: '#fff',
                  background: 'var(--button-gradient)',
                  boxShadow: '0 14px 30px rgba(6, 182, 212, 0.22)',
                  '&:hover': { filter: 'brightness(1.04)' },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Tooltip>

          <Tooltip title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'var(--text-primary)',
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: 'var(--text-primary)',
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: 10,
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={user?.username || 'Profile'}>
            <IconButton onClick={() => navigate('/profile')} sx={{ p: 0.3 }}>
              <Avatar
                alt={user?.username}
                src={user?.avatar}
                sx={{
                  width: 38,
                  height: 38,
                  border: '2px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 10px 22px rgba(2, 6, 23, 0.3)',
                  ...getAvatarStyle(user?.username),
                }}
              >
                {getAvatarInitials(user?.username)}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: 'var(--text-primary)',
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
