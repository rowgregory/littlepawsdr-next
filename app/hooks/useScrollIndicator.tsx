import { useState, useEffect } from 'react';
import { toggleBgColor, toggleNavbar } from '@redux/features/navbarSlice';
import { useAppDispatch } from '@redux/store';

const useScrollIndicator = () => {
  const dispatch = useAppDispatch();
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const currentScrollTop = window.scrollY;

    if (currentScrollTop === 0) {
      dispatch(toggleBgColor({ bgColor: true }));
    } else {
      dispatch(toggleBgColor({ bgColor: false }));
    }

    function handleScroll() {
      const currentScrollTop = window.scrollY;
      if (currentScrollTop > lastScrollTop) {
        dispatch(toggleNavbar({ navbar: true }));
      } else {
        dispatch(toggleNavbar({ navbar: false }));
      }

      if (currentScrollTop === 0) {
        dispatch(toggleBgColor({ bgColor: true }));
      } else {
        dispatch(toggleBgColor({ bgColor: false }));
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop, dispatch]);
};

export default useScrollIndicator;
