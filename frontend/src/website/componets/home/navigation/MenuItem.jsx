import { memo } from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ item, index }) => (
  <Link
    to={item.href}
    className={`flex md:flex-col gap-4 items-center sm:justify-center pl-3 sm:pl-0 hover:bg-main transition-colors text-main  hover:text-white group lg:px-4 py-3 lg:py-6 ${index % 2 === 1 ? 'border-t-2 md:border-t-0' : ''}`}
  >
    <div className="text-secondary group-hover:scale-110 transition-transform">
      <img 
        src={`/api/logo/download/${item.icon}`} 
        alt={item.name || 'img'} 
        className="sm:w-10 w-5 object-fit sm:h-10 h-8 sm:object-fill"
        loading="lazy" 
        width="40"
        height="40"
      />
    </div>
    <span className="text-center 
     sm:text-[18px] text-[16px] font-bold">{item.name}</span>
  </Link>
);

export default memo(MenuItem);