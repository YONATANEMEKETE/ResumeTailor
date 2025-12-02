import React from 'react';
import { ShiningText } from '../ui/shining-text';

interface props {
  text: string;
}

const LoadingResponseIndicator = ({ text }: props) => {
  return (
    <div className="w-full h-12 border border-border rounded-md p-3">
      <ShiningText text={text} />
    </div>
  );
};

export default LoadingResponseIndicator;
