import { ShiningText } from '../ui/shining-text';
import ClassicLoader from '../ui/loader';

interface props {
  text: string;
}

const LoadingResponseIndicator = ({ text }: props) => {
  return (
    <div className="flex items-center gap-x-2">
      <ClassicLoader />
      <ShiningText text={text} />
    </div>
  );
};

export default LoadingResponseIndicator;
