export interface Guide {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string;
  manualUrl: string;
  extraManualUrl?: string;
  extraManualLabel?: string;
  videoUrl?: string;
  extraVideoUrl?: string;
} 