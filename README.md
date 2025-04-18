# Environment for a fullstack web project!

# Running the Frontend (client)

## Required downloads

Beforehand, make sure to download nodejs https://nodejs.org/en/download

I recommend version 20.16 (LTS).

Once installed, you can do the following:

## Downloading and running the project

go to the client directory and run the following commands in the terminal of your IDE (probably vscode):

- npm i

npm i is used to install all dependencies locally into your computer into a folder called node_modules

- npm run dev

runs the app

The client should be running on http://localhost:5173/

<hr/>

# Running the Backend (server)

## Required downloads

Beforehand, make sure to download python: https://www.python.org/downloads/

The python version used to setup this environment was 3.12.0

Once python is installed, you can head on to your IDE and do the following

## Downloading and running the project

go into the server directory and run
- pip3 install -r requirements.txt

this installs all of the libraries needed to run flask.

After that, all thats left to do is run
- flask run -p 8000

You can see if its working by going to the url http://127.0.0.1:8000/
