import { RootState, useAppSelector } from '@redux/store';
import React from 'react';

const Overlay = () => {
  const navbar = useAppSelector((state: RootState) => state.navbar);

  return (
    <div
      className={`${
        navbar.toggle.navigationDrawer ? 'block' : 'hidden'
      } fixed top-0 left-0 h-screen w-screen bg-black opacity-80 z-[3000] duration-300`}
    />
  );
};

export default Overlay;
