# Real-time React File Explorer

## Tech

I built this project by using React.JS + Node.JS stack:
- Frontend - React.JS(React Hooks), Material UI(Styling), socket.io-client(Web Socket Client)
- Backend - Node.JS, Socket.IO(Web Socket Server), Chokidar(to watch directory update)


## Installation

Install the dependencies and and start the server for both backend and frontend.

```sh
cd client
npm install
npm start
```

```sh
cd server
npm install
npm start
```


## Solution

For the first page(http://localhost: 3000/), you should input the paths you want to load.
Input is the tag input where you can add the paths by clicking the `Enter` key.
Once you click `Load Paths`, you will be redirected to the `/explorer`.
That button click will create the connection between server and client for each path.
For that first trigger, the server will send the all sub directories/files to the client to show the current state.
And chokidar will set up the watcher that detects the changes(create/rename/delete subfolder) in order to trigger the data changes for client side.

With this solution, we can get up-to-date for sub directories/files of the input paths all the time.

## Improvement
There will be a lot more logic to implement on this project.
But one thing I am willing to implement for the next time if you want is async path load.
Now we are loading all subdirectories and files for the input paths at once.
And that will take some time and possibly have thousands of items to show.
Ideally, we should trigger the event to the server every time a user expands the subdirectory.
Hope the current things are good enough for you but again I will implement this feature if you want.

