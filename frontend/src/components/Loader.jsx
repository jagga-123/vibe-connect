import { Box, Card, CardContent, Skeleton } from '@mui/material';

const Loader = ({ count = 3 }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="glass-card pulse-skeleton"
          sx={{
            borderRadius: '28px',
            overflow: 'hidden',
            background: 'rgba(17, 24, 39, 0.84)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Skeleton variant="circular" width={52} height={52} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="38%" height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
                <Skeleton variant="text" width="22%" height={18} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
              </Box>
              <Skeleton variant="circular" width={36} height={36} sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)' }} />
            </Box>

            <Skeleton variant="text" width="92%" height={22} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mb: 0.8 }} />
            <Skeleton variant="text" width="82%" height={22} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mb: 0.8 }} />
            <Skeleton variant="text" width="64%" height={22} sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mb: 2 }} />

            {index % 2 === 0 && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={280}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '22px',
                  mb: 2,
                }}
              />
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1 }}>
              <Skeleton variant="rounded" height={42} sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)', borderRadius: '16px' }} />
              <Skeleton variant="rounded" height={42} sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)', borderRadius: '16px' }} />
              <Skeleton variant="rounded" height={42} sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)', borderRadius: '16px' }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Loader;
