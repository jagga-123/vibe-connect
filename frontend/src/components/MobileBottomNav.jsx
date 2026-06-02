import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material';
import {
  HomeRounded as HomeIcon,
  PersonRounded as ProfileIcon,
  ChatBubbleRounded as MessagesIcon,
  NotificationsRounded as NotificationsIcon,
  SettingsRounded as SettingsIcon,
} from '@mui/icons-material';

const mobileNavItems = [
  { label: 'Home', value: '/', icon: <HomeIcon />, route: '/' },
  { label: 'Profile', value: '/profile', icon: <ProfileIcon />, route: '/profile' },
  { label: 'Messages', value: 'messages', icon: <MessagesIcon />, disabled: true },
  { label: 'Alerts', value: 'alerts', icon: <NotificationsIcon />, disabled: true, badge: 3 },
  { label: 'Settings', value: 'settings', icon: <SettingsIcon />, disabled: true },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const value = location.pathname;

  return (
    <Paper
      elevation={0}
      className="mobile-bottom-nav"
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar + 1,
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        sx={{
          background: 'transparent',
          height: 72,
          '& .MuiBottomNavigationAction-root': {
            color: 'var(--text-secondary)',
            minWidth: 0,
            paddingTop: 0.75,
            gap: 0.35,
          },
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            color: '#f8fafc',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
          },
        }}
      >
        {mobileNavItems.map((item) => {
          const icon = item.badge ? (
            <Badge badgeContent={item.badge} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
              {item.icon}
            </Badge>
          ) : (
            item.icon
          );

          return (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              value={item.value}
              icon={icon}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled && item.route) {
                  navigate(item.route);
                }
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;
