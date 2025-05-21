import React from 'react';
import Icon from '../common/Icon';

const FooterLocationText = ({ obj }: { obj: any }) => {
  return (
    <div className="flex items-center">
      <Icon icon={obj.icon} className="text-teal-400 mr-3 w-3 h-3" />
      <p className="text-white text-sm font-QLight tracking-wide">
        {obj.textKey}
      </p>
    </div>
  );
};

export default FooterLocationText;
