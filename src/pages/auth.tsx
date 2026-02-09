import Logo from "../components/header";
import LoginPanel from "../components/auth/login";
import YouTubeEmbed from "../components/info";
import RegisterForm from "../components/auth/register";

import bgImage from "../assets/image.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
    <div className="relative z-50 bg-gray-200 shadow-md">
    <div className="h-[25vh] md:h-[10vh] flex items-center px-6">
    <div className="w-full flex items-center justify-between gap-4">
      
      {/* <div className="w-1/2">
        <div className="w-full max-w-2xl mx-auto overflow-visible">
          <Logo />
        </div>
      </div> */}

      <div className="flex-shrink-0">
        <Logo />
      </div>

      <div className="flex-1 flex items-center">
        <div className="ml-auto w-auto">
          <LoginPanel />
        </div>
      </div>



      {/* <div className="w-1/2 flex justify-end items-center">
        <div className="w-full hidden md:block">
          <LoginPanel />
        </div>
      </div> */}

    </div>
    </div>
  </div>

      <div className="relative flex-1 overflow-hidden">
  
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 via-blue-900/90 to-blue-950/95" />

        <div className="relative z-10 h-full px-6 pb-12 pt-12 md:pt-30 flex flex-col md:flex-row gap-6">
          
          <div className="w-full md:w-1/2 flex items-stretch justify-center">
            <div className="w-full max-w-2xl flex">
              <YouTubeEmbed />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex items-stretch justify-center md:justify-end">
            <div className="w-full max-w-md flex md:ml-10">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
