import ForPc from "./ForPc"
import ForMobile from "./ForMobile"

const Navbar = () => {
  return (
    <div className="bg-[#1C2A47] z-50 w-full shadow-md fixed top-0">
      <ForPc />
      <ForMobile />
    </div>
  )
}

export default Navbar
