import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Collapse,
  IconButton,
  Box,
  styled,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

interface GuideCardProps {
  title: string;
  description: string;
  image: string;
  details: string;
  manualUrl: string;
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
  videoUrl,
  extraVideoUrl,
  onVideoClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleVideoClick = () => {
    if (onVideoClick && videoUrl) {
      const urls = extraVideoUrl ? [videoUrl, extraVideoUrl] : [videoUrl];
      onVideoClick(urls);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        
        <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
          <a
            href={manualUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Typography
              variant="button"
              color="primary"
              sx={{
                display: 'inline-block',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Open Manual
            </Typography>
          </a>
          {videoUrl && (
            <Typography
              variant="button"
              color="primary"
              onClick={handleVideoClick}
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Watch Tutorial
            </Typography>
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
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default GuideCard; 