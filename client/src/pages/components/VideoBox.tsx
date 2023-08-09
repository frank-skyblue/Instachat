import React, { useEffect, useRef } from "react";

interface Props {
  stream: MediaStream;
  muted?: boolean
}

export const VideoBox: React.FC<Props> = ({ stream, muted = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    videoRef.current!.srcObject = stream;
  }, [stream]);

  return (
    <video
      autoPlay
      muted={muted}
      className="video-box border rounded "
      ref={videoRef}
    />
  );
};
