function Home() {
  return (
    <>
      {/* This CSS library is tailwind, utilizing inline classnames to set css values */}
      <div className="flex h-screen w-screen bg-gradient-to-r from-[#2A7B9B] to-[#EDDD53] justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl mt-20 text-center">Broncohacks 2025!</h1>

          {/* Images are held in public, no need to say /public it assumes it starts from that directory */}
          <img
            src="/BroncoHacksSquareLogo.png"
            className="w-[20vw] h-auto rounded-full"
          ></img>
        </div>
      </div>
    </>
  );
}

export default Home;
