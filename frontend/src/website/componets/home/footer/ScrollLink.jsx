import { Link } from 'react-router-dom';

export default function ScrollLink({ to, children, className, navigate }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate(to);
    }, 500);
  };

  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}