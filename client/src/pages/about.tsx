import { useState } from "react";

function About() {
  // Counter is a variable. It is being initalized as 0 from the useState(). The <number> is a typescript typing to specify that counter can only be a number
  // setCounter is a function that changes the value of counter. For example, setCounter(1738) will set the value counter to 1738. It always uses the convention set[variablename] in camelCase
  // Use a useState whenever you want to change a variable within a page
  const [counter, setCounter] = useState<number>(0);

  return (
    <>
      <div className="flex h-screen w-screen bg-gradient-to-r from-red-500 to-blue-500 justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl mt-20 text-center">About Page</h1>
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
        </div>
      </div>
    </>
  );
}

export default About;
