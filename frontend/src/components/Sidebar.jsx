import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAvatarStyle, getAvatarInitials } from '../services/avatarHelper';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  ChatBubbleRounded as MessageIcon,
  NotificationsRounded as NotificationsIcon,
  SettingsRounded as SettingsIcon,
  AutoGraphRounded as StatsIcon,
} from '@mui/icons-material';

const Sidebar = ({ stats = {} }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Messages', icon: <MessageIcon />, path: '#messages', disabled: true },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '#notifications', disabled: true },
    { text: 'Settings', icon: <SettingsIcon />, path: '#settings', disabled: true },
  ];

  const displayStats = {
    posts: stats.posts ?? user?.postsCount ?? 24,
    followers: stats.followers ?? user?.followersCount ?? '1.2k',
    following: stats.following ?? user?.followingCount ?? 580,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
      <Card
        className="glass-card hover-scale fade-in-entry"
        sx={{
          borderRadius: '26px',
          overflow: 'hidden',
          background: 'rgba(17, 24, 39, 0.86)',
        }}
      >
        <Box
          sx={{
            height: 96,
            background:
              'radial-gradient(circle at 20% 20%, rgba(103, 232, 249, 0.45), transparent 28%), radial-gradient(circle at 80% 0%, rgba(139, 92, 246, 0.36), transparent 26%), linear-gradient(135deg, rgba(8, 145, 178, 0.85), rgba(139, 92, 246, 0.78))',
          }}
        />
        <CardContent sx={{ p: 3, pt: 0, mt: -5, position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            <Avatar
              src={user?.avatar}
              alt={user?.username}
              sx={{
                width: 84,
                height: 84,
                border: '4px solid rgba(15, 23, 42, 0.96)',
                boxShadow: '0 20px 34px rgba(2, 6, 23, 0.45)',
                ...getAvatarStyle(user?.username),
              }}
            >
              {getAvatarInitials(user?.username)}
            </Avatar>

            <Chip
              icon={<StatsIcon sx={{ fontSize: 16 }} />}
              label="Active now"
              size="small"
              sx={{
                bgcolor: 'rgba(6, 182, 212, 0.12)',
                color: '#7dd3fc',
                fontWeight: 700,
                border: '1px solid rgba(6, 182, 212, 0.18)',
              }}
            />
          </Box>

          <Box sx={{ mt: 2.2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {user?.username}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-secondary)',
                wordBreak: 'break-word',
                mt: 0.7,
              }}
            >
              {user?.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 2.25, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 1.25,
            }}
          >
            {[
              { label: 'Posts', value: displayStats.posts },
              { label: 'Followers', value: displayStats.followers },
              { label: 'Following', value: displayStats.following },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 1.3,
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {item.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                  {item.label}
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
        <CardContent sx={{ p: 1.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              px: 1.5,
              pb: 1,
              pt: 0.5,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 800,
            }}
          >
            Navigation
          </Typography>
          <List disablePadding>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.text}
                  onClick={() => !item.disabled && navigate(item.path)}
                  disabled={item.disabled}
                  sx={{
                    borderRadius: '18px',
                    mb: 0.7,
                    py: 1.2,
                    px: 1.5,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.16), rgba(139, 92, 246, 0.14))'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.04)',
                      '& .MuiListItemIcon-root': {
                        color: 'var(--accent-color)',
                        transform: 'translateX(2px)',
                      },
                    },
                    opacity: item.disabled ? 0.72 : 1,
                    transition: 'all 180ms ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 42,
                      color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                      transition: 'transform 180ms ease, color 180ms ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    secondary={item.disabled ? 'Coming soon' : undefined}
                    primaryTypographyProps={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: 'inherit',
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Sidebar;
