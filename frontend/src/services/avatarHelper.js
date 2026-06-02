/**
 * Dynamic Avatar Styling Helper
 * Generates beautiful, responsive CSS gradients based on a hashed username.
 * Eliminates slow loading times and CORS issues with external avatar APIs.
 */

export const getAvatarStyle = (username = 'User') => {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo-Violet
    'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', // Rose
    'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', // Sky
    'linear-gradient(135deg, #10b981 0%, #34d399 100%)', // Emerald
    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', // Amber
    'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', // Pink
  ];

  let hash = 0;
  const nameStr = String(username);
  for (let i = 0; i < nameStr.length; i++) {
    hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;

  return {
    background: gradients[index],
    color: '#ffffff',
    fontWeight: 700,
    textShadow: '0 1px 2px rgba(0,0,0,0.15)',
  };
};

export const getAvatarInitials = (username = 'User') => {
  if (!username) return 'U';
  return String(username).charAt(0).toUpperCase();
};
