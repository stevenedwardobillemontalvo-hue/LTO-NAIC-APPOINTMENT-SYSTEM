const YouTubeEmbed = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-3">
        

        <h2 className="text-xl md:text-4xl text-white leading-tight">
          HOW TO GET LTO <span className="font-bold">DRIVER'S LICENSE</span>
        </h2>

        <iframe
          className="w-full aspect-video rounded shadow-lg"
          src="https://www.youtube.com/embed/l0uB5X6xvHA?si=otRQXwxzEtFdbzmg"
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        <div className="flex flex-col gap-1">
          <p className="text-xl md:text-4xl font-semibold text-white leading-tight">
            LTO NAIC ONLINE APPOINTMENT
          </p>
          <p className="text-xl md:text-3xl text-white leading-tight">
            APPLY NOW!
          </p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeEmbed;
