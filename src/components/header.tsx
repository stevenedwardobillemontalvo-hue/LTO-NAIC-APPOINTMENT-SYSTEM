import LTOLogo from "../assets/LTO.png";

const Logo = () => {
  return (
    <div className="relative flex items-center gap-4">
      
      <div className="relative">
        <img
          src={LTOLogo}
          alt="LTO Logo"
          className="
            w-30 h-30 md:w-28 md:h-28
            mb-3 md:-mb-8
            drop-shadow-md
          "
        />
      </div>

      <div className="hidden md:flex flex-col leading-tight text-gray-800 uppercase">
        <p className="text-xs md:text-sm tracking-wide">
          Department of Transportation
        </p>
        <p className="font-bold text-sm md:text-base">
          Land Transportation Office
        </p>
        <p className="text-xs md:text-sm">
          Naic, Cavite
        </p>
      </div>
    </div>
  );
};

export default Logo;
