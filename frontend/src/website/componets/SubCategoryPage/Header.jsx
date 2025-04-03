import img from "../../../assets/product-chemicals.png"
export default function Header() {
    return (
      <header className="w-full h-[250px] relative">
        <img
          src={img}
          alt="Chemistry laboratory banner"
          className="w-full h-full object-cover"
        />
       
      </header>
    )
  }
  
  