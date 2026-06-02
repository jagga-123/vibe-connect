import {
  Email as EmailIcon,
  Lock as LockIcon,
  ArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Validate form inputs
  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address format.';
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #030712 0%, #0F172A 50%, #111827 100%)',
        backgroundAttachment: 'fixed',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 25s ease-in-out infinite',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-20%',
          left: '-15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(45px)',
          animation: 'float 30s ease-in-out infinite reverse',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Decorative glowing orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'glow-pulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'glow-pulse 5s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      {/* Main Auth Card */}
      <Card
        className="glass-card fade-in-entry card-hover"
        sx={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(17, 24, 39, 0.75)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        {/* Card background accent */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <CardContent sx={{ p: { xs: 5, md: 7 }, position: 'relative', zIndex: 1 }}>
          {/* Logo & Title Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {/* Animated Logo */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '72px',
                height: '72px',
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                borderRadius: '16px',
                mb: 3,
                border: '1px solid rgba(34, 211, 238, 0.3)',
                margin: '0 auto 28px',
                boxShadow: '0 8px 32px rgba(34, 211, 238, 0.2)',
                animation: 'float-up 3s ease-in-out infinite',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2rem',
                }}
              >
                V
              </Typography>
            </Box>

            {/* Brand Name */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.8px',
                background: 'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 50%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                lineHeight: 1.2,
                animation: 'slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              VibeConnect
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body2"
              sx={{
                color: '#94A3B8',
                fontWeight: 500,
                fontSize: '0.95rem',
                letterSpacing: '0.2px',
                animation: 'slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
              }}
            >
              Welcome back! Continue your social journey
            </Typography>
          </Box>

          {/* Error Alert */}
          {apiError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FECACA',
                animation: 'slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '& .MuiAlert-icon': {
                  color: '#EF4444',
                },
              }}
            >
              {apiError}
            </Alert>
          )}

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {/* Email Field */}
            <Box
              sx={{
                animation: 'slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #22D3EE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Email Address
              </Typography>
              <TextField
                placeholder="name@company.com"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: '#111827',
                    border: '2px solid #334155',
                    borderRadius: '12px',
                    padding: '2px 12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: 'rgba(34, 211, 238, 0.5)',
                      background: 'rgba(17, 24, 39, 0.95)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#22D3EE',
                      boxShadow: '0 0 0 3px rgba(34, 211, 238, 0.15)',
                      background: '#111827',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.6,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#FFFFFF',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#64748B',
                    opacity: 0.8,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon
                        sx={{
                          color: '#22D3EE',
                          mr: 1.2,
                          fontSize: '1.3rem',
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              {errors.email && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#F87171',
                    display: 'block',
                    mt: 1,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                >
                  ✕ {errors.email}
                </Typography>
              )}
            </Box>

            {/* Password Field */}
            <Box
              sx={{
                animation: 'slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #22D3EE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Password
              </Typography>
              <TextField
                placeholder="••••••••••"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: '#111827',
                    border: '2px solid #334155',
                    borderRadius: '12px',
                    padding: '2px 12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: 'rgba(34, 211, 238, 0.5)',
                      background: 'rgba(17, 24, 39, 0.95)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#22D3EE',
                      boxShadow: '0 0 0 3px rgba(34, 211, 238, 0.15)',
                      background: '#111827',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.6,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#FFFFFF',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#64748B',
                    opacity: 0.8,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon
                        sx={{
                          color: '#22D3EE',
                          mr: 1.2,
                          fontSize: '1.3rem',
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              {errors.password && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#F87171',
                    display: 'block',
                    mt: 1,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                >
                  ✕ {errors.password}
                </Typography>
              )}
            </Box>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              sx={{
                mt: 2,
                py: 2,
                background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '0.3px',
                boxShadow: '0 10px 30px rgba(34, 211, 238, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: 'slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both',
                position: 'relative',
                overflow: 'hidden',
                border: 'none',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s ease',
                },
                '&:hover:not(:disabled)': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 15px 40px rgba(34, 211, 238, 0.4)',
                  '&::before': {
                    left: '100%',
                  },
                },
                '&:active:not(:disabled)': {
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  opacity: 0.7,
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                  <span>Signing in...</span>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Sign In</span>
                  <ArrowRightIcon sx={{ fontSize: '1.2rem' }} />
                </Box>
              )}
            </Button>

            {/* Signup Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.9rem',
                  animation: 'slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both',
                }}
              >
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  style={{
                    background: 'linear-gradient(90deg, #22D3EE, #8B5CF6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textDecoration: 'none',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.filter = 'brightness(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.filter = 'brightness(1)';
                  }}
                >
                  Create account
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
