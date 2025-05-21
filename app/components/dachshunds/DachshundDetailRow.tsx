import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import Icon from '../common/Icon';

const DachshundDetailRow = ({
  icon,
  text,
}: {
  icon: IconDefinition;
  text: string;
}) => {
  return (
    <div className="flex items-center">
      <Icon icon={icon} className="text-teal-400 w-4 h-4 mr-2" />
      <p>{text}</p>
    </div>
  );
};

export default DachshundDetailRow;
