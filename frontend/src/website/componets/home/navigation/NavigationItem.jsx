import { memo } from 'react';
import MenuItem from './MenuItem';

const NavigationItems = ({ items }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-y-2 md:divide-y-0 divide-gray-700/10">
    {items.map((item, index) => (
      <MenuItem key={item._id} item={item} index={index} />
    ))}
  </div>
);

export default memo(NavigationItems);