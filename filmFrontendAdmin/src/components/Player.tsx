import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

export default function VideoPlayer({ src }:{src:string}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const playerRef = useRef<Plyr | null>(null);
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
    
        video.controls = true;
        const defaultOptions:any = {};
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // This will run in safari, where HLS is supported natively
          video.src = src;
        } else if (Hls.isSupported()) {
          // This will run in all other modern browsers
    
          const hls = new Hls();
          hls.loadSource(src);
          
          const player = new Plyr(video, defaultOptions);
          hls.attachMedia(video);
          hlsRef.current = hls;
        playerRef.current = new Plyr(video);
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
          });
        } else {
          console.error(
            'This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API'
          );
        }
        return () => {
            // Clean up Hls.js instance
            if (hlsRef.current) {
              hlsRef.current.destroy();
              hlsRef.current = null;
            }
      
            // Clean up Plyr instance
            if (playerRef.current) {
              playerRef.current.destroy();
              playerRef.current = null;
            }
          };
      }, [src, videoRef]);

  return (
    <>
      <video data-displaymaxtap ref={videoRef} autoPlay  />
      <style jsx>{`
        video {
          max-width: 100%;
          height: calc(7/16 * 100vw)
        }
      `}</style>
    </>
  );
}
