import React, { useState } from 'react';
import { Grid, Container, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import GuideCard from './GuideCard';
import { Guide } from '../types/guide';

interface GuideGridProps {
  guides: Guide[];
}

const GuideGrid: React.FC<GuideGridProps> = ({ guides }) => {
  const [selectedVideos, setSelectedVideos] = useState<string[] | null>(null);

  const handleVideoClick = (urls: string[]) => {
    setSelectedVideos(urls);
  };

  const handleCloseVideos = () => {
    setSelectedVideos(null);
  };

  return (
    <Container maxWidth="xl">
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
        {guides.map((guide) => (
          <Grid 
            key={guide.id}
            sx={{
              width: {
                xs: '100%',
                sm: '50%',
                md: '33.33%',
                lg: '25%'
              },
              maxWidth: {
                xs: '100%',
                sm: '400px',
                md: '350px',
                lg: '300px'
              }
            }}
          >
            <GuideCard
              title={guide.title}
              description={guide.description}
              image={guide.image}
              details={guide.details}
              manualUrl={guide.manualUrl}
              extraManualUrl={guide.extraManualUrl}
              extraManualLabel={guide.extraManualLabel}
              videoUrl={guide.videoUrl}
              extraVideoUrl={guide.extraVideoUrl}
              onVideoClick={handleVideoClick}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedVideos}
        onClose={handleCloseVideos}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <IconButton
            onClick={handleCloseVideos}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedVideos?.map((video, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                marginBottom: idx < selectedVideos.length - 1 ? '1rem' : 0,
              }}
            >
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                src={video.replace('youtu.be', 'youtube.com/embed').replace('watch?v=', 'embed/')}
                title={`YouTube video player ${idx + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default GuideGrid; 