import { useEffect, useState } from "react";
import { uri } from "../App";

//Used to specify the data of the Get Request from the backend
interface GetRequest {
  location: string;
  message: string;
}

function Home() {
  // Counter is a variable. It is being initalized as 0 from the useState(). The <number> is a typescript typing to specify that counter can only be a number
  // setCounter is a function that changes the value of counter. For example, setCounter(1738) will set the value counter to 1738. It always uses the convention set[variablename] in camelCase
  // Use a useState whenever you want to change a variable within a page
  // The typing <number> makes it so the interpreter complains if you try to set it to a string like setCounter('1738')
  const [counter, setCounter] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  //Whenever something is updated in the second parameter (the array), this hook will run. Right now its empty meaning it will only run once. We will use this to call data from the backend.
  useEffect(() => {
    //Lets call the data from the backend by initalizing the function
    const getData = async () => {
      try {
        const res = await fetch(`${uri}/`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }); //uri is imported from App.tsx
        const toJson = (await res.json()) as GetRequest; //Convert the raw data to JSON, specifiying the data is to be returned as GetRequest
        setMessage(toJson.message); //Finally, set the message, Because we set the type as GetRequest, we know that toJson will have a .message attribute
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, []);

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

          {/* You can set js variables directly into an html element like this */}
          <h2>Counter: {counter}</h2>

          {/* You can also set js functions such as this useState directly in the element */}
          <button
            className="p-5 bg-black rounded-3xl"
            onClick={() => {
              setCounter(counter + 1);
            }}
          >
            Update Counter
          </button>

          {/* We use the welcomeMessage && syntax to only show the next element IF welcomeMessage is defined / when the data from the backend is fully loaded (takes time to send the data over and isnt ready off the bat*/}
          {message && <div>Message from the backend: {message}</div>}
        </div>
      </div>
    </>
  );
}

export default Home;
