import { Link } from "react-router";

const Header = () => {
  return (
    <div className="absolute w-screen h-[5vh] bg-black border-white">
      <div className="flex text-white h-[5vh]">
        {/* Links change the current url page. You can see all the list of url pages in App.tsx */}
        <Link to="/" className="my-auto mr-auto ml-5">
          Home
        </Link>
        <Link to="/about" className="my-auto ml-auto mr-5">
          About
        </Link>
      </div>
    </div>
  );
};

export default Header;
