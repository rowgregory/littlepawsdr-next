import { useEffect, useRef, useState } from "react";

const useVideo = () => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null) as any;

  useEffect(() => {
    const handleLoad = () => setLoading(false);

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("loadeddata", handleLoad);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadeddata", handleLoad);
      }
    };
  }, []);

  return { loading, videoRef };
};

export default useVideo;
