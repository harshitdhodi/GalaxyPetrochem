import img from '../images/introduction.png'
import { Banner } from '../componets/Banner';
import MainContent from '../componets/Introduction/MainContent';
import AboutDescription from '../componets/home/AboutUs';
// In your page component:
function Introduction() {
  return (
    <div className=''>
      {/* <Banner imageUrl={img} /> */}
      <MainContent />
        
      {/* Rest of your content */}
    </div>
  );
}

export default Introduction; 