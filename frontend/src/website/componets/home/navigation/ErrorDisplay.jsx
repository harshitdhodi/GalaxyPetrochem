import { memo } from 'react';

const ErrorDisplay = ({ message }) => (
  <div className="text-center p-4 text-red-500">{message}</div>
);

export default memo(ErrorDisplay)