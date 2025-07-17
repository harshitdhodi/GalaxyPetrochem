import ScrollLink from './ScrollLink';

export default function CorporateSection({ navigate }) {
  return (
    <div className='col-span-2 sm:col-span-1'>
      <h2 className="text-xl font-medium mb-6">Quick Links</h2>
      <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
        <li>
          <ScrollLink to="/introduction" className="hover:text-gray-200 block" navigate={navigate}>
            About Us
          </ScrollLink>
        </li>
        <li>
          <ScrollLink to="/introduction" className="hover:text-gray-200 block" navigate={navigate}>
            Products
          </ScrollLink>
        </li>
        <li>
          <ScrollLink to="/vision-mission" className="hover:text-gray-200 block" navigate={navigate}>
            Blogs
          </ScrollLink>
        </li>
        <li>
          <ScrollLink to="/vision-mission" className="hover:text-gray-200 block" navigate={navigate}>
            Brands
          </ScrollLink>
        </li>
      </ul>
    </div>
  );
}