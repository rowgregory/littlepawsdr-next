import Link from 'next/link';
import React, { FC } from 'react';

interface RightArrowProps {
  text: string;
  url: string;
}

const RightArrow: FC<RightArrowProps> = ({ text, url }) => {
  return (
    <Link href={url} className="group flex items-center">
      <p className="mr-2 text-xs">{text}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 476.213 476.213"
        className="transform group-hover:translate-x-2 duration-300"
        width="20px"
        height="20px"
      >
        <polygon
          fill="#7f8282"
          points="476.213,238.105 400,161.893 400,223.106 0,223.106 0,253.106 400,253.106 400,314.32 "
        />
      </svg>
    </Link>
  );
};

export default RightArrow;
