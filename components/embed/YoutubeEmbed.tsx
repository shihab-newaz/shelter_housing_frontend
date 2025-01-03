// src/components/YouTubeEmbed.tsx
import React from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full youtube-container">
        <iframe
          width="1280"
          height="720"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}&vq=hd1080&rel=0&showinfo=0&iv_load_policy=3&start=11`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ objectFit: 'cover' }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default YouTubeEmbed;