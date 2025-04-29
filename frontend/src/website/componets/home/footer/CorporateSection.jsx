import ScrollLink from './ScrollLink';

export default function CorporateSection({ navigate }) {
  return (
    <div className='col-span-2 sm:col-span-1'>
      <h2 className="text-xl font-medium mb-6">Corporate</h2>
      <ul className="sm:space-y-3 flex sm:block gap-8 justify-start text-sm">
        <li>
          <ScrollLink to="/introduction" className="hover:text-gray-200" navigate={navigate}>
            About Us
          </ScrollLink>
        </li>
        <li>
          <ScrollLink to="/vision-mission" className="hover:text-gray-200" navigate={navigate}>
            Blogs
          </ScrollLink>
        </li>
        <li>
          <ScrollLink to="/vision-mission" className="hover:text-gray-200" navigate={navigate}>
            Brands
          </ScrollLink>
        </li>
      </ul>
    </div>
  );
}