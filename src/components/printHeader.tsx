import LTOLogo from "../assets/LTO.png";

const PrintLogo = () => {
  return (
    <div className="relative flex items-center gap-4">
      
      <div className="relative">
        <img
          src={LTOLogo}
          alt="LTO Logo"
          className="
            w-25 h-25 md:w-25 md:h-25
            mb-3 md:-mb-8
            drop-shadow-md
          "
        />
      </div>

      <div className="flex flex-col leading-tight text-gray-800 uppercase">
        <p className="text-l md:text-l tracking-wide">
          Department of Transportation
        </p>
        <p className="font-bold text-l md:text-base">
          Land Transportation Office
        </p>
        <p className="text-l md:text-l">
          Naic, Cavite
        </p>
      </div>
    </div>
  );
};

export default PrintLogo;
