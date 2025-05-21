import { useCallback, useEffect, useRef } from 'react';

const useOutsideDetect = (callback: any) => {
  const ref = useRef(null) as any;

  const handleClickOutside = useCallback(
    (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, handleClickOutside]);

  return ref;
};

export default useOutsideDetect;
