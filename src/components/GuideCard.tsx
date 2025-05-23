import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Collapse,
  IconButton,
  Box,
  styled,
  Button,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';

interface GuideCardProps {
  title: string;
  description: string;
  image: string;
  details: string;
  manualUrl: string;
  extraManualUrl?: string;
  extraManualLabel?: string;
  videoUrl?: string;
  extraVideoUrl?: string;
  onVideoClick?: (urls: string[]) => void;
}

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const GuideCard: React.FC<GuideCardProps> = ({
  title,
  description,
  image,
  details,
  manualUrl,
  extraManualUrl,
  extraManualLabel,
  videoUrl,
  extraVideoUrl,
  onVideoClick,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleVideoClick = () => {
    if (onVideoClick && videoUrl) {
      const urls = [videoUrl];
      if (extraVideoUrl) {
        urls.push(extraVideoUrl);
      }
      onVideoClick(urls);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '87.5%', // 16:14 aspect ratio
          overflow: 'hidden',
          backgroundColor: '#ffffff' // White background
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#ffffff' // White background
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            href={manualUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ flex: 1, minWidth: '120px' }}
          >
            View Manual
          </Button>
          {videoUrl && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleVideoClick}
              startIcon={<PlayArrowIcon />}
              sx={{ flex: 1, minWidth: '120px' }}
            >
              Watch Video
            </Button>
          )}
        </Box>
      </CardContent>

      <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 1 }}>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{details}</Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {extraManualUrl && (
              <Button
                variant="contained"
                color="primary"
                href={extraManualUrl}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
              >
                {extraManualLabel || 'Extra Manual'}
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              href="/SM58-user-guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
            >
              SM58 Manual
            </Button>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default GuideCard; 