import { FC, memo } from 'react';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type IconProps = {
  icon: IconDefinition;
  className?: string;
};

const Icon: FC<IconProps> = memo(({ icon, className }) => (
  <FontAwesomeIcon icon={icon} className={className} />
));

Icon.displayName = 'Icon';

export default Icon;
