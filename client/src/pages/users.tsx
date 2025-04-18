import { useEffect, useState } from "react";
import { uri } from "../App";

interface UserModel {
  id: string;
  name: string;
  major: string;
}

function Users() {
  //Same concept but allUsers will now only be a UserModel
  const [allUsers, setAllUsers] = useState<UserModel[]>();

  //Used to send data
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`${uri}/users/`);
        const users = (await res.json()) as UserModel[];
        setAllUsers(users);
      } catch (error) {
        alert(error);
      }
    };
    getUsers();
  }, []);

  const sendToServer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //If empty do not send

    //Initializing body
    const body = {
      name,
      major,
    };

    try {
      const res = await fetch(`${uri}/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log(res);
      if (!res.ok) alert("Failed to create user");

      // Refresh the list of users
      const res2 = await fetch(`${uri}/users/`);
      const users = (await res2.json()) as UserModel[];
      setAllUsers(users);

      //Restart form
      setName("");
      setMajor("");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="flex h-screen w-screen bg-gradient-to-r from-red-500 to-blue-500 justify-center text-white overflow-scroll">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl mt-20 text-center">Users Page</h1>

          {/* Heres an example of sending things to the backend */}
          <form
            className="flex flex-col bg-white rounded-3xl p-4 text-black gap-5"
            onSubmit={sendToServer}
          >
            <label>Name:</label>
            <input
              placeholder="ex: Daniel"
              className="bg-gray-100 rounded-xl p-1"
              onChange={(e) => setName(e.target.value)}
            ></input>
            <label>Major:</label>
            <input
              placeholder="ex: Computer Science :("
              className="bg-gray-100 rounded-xl p-1"
              onChange={(e) => setMajor(e.target.value)}
            ></input>{" "}
            <button
              type="submit"
              className="p-1 bg-black rounded-3xl text-white"
              onClick={() => {}}
            >
              Create User
            </button>
          </form>

          <h2 className="text-2xl">list of users from backend:</h2>

          {/* Showing the pulled data, remember that the allUsers && is to allow the data to load first */}
          {allUsers &&
            allUsers.map((user) => (
              <div key={user.id} className="text-black pb-5">
                {user.name}, {user.major}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Users;
