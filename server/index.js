const fs = require("fs")
const path = require("path")
const chokidar = require('chokidar');
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const LOAD_DATA_FOR_PATHS = "loadDataForPaths";

const getAllFiles = function(dirPath, filePath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      let newDir = [];
      arrayOfFiles.push(getAllFiles(dirPath + "/" + file, file, newDir));
    } else {
    //   arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
      arrayOfFiles.push({
        id: path.join(__dirname, dirPath, "/", file),
        name: file
      })
    }
  })

  return {
    id: path.join(__dirname, dirPath),
    name: filePath,
    children: arrayOfFiles
  }
}

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Submit new path
  const { basePath } = socket.handshake.query;
  socket.join(basePath);

  // Setup chokidar watcher for path
  const watcher = chokidar.watch(basePath, { persistent: true });
  let isLoaded = false;

  // Listen for the initial load
  socket.on(LOAD_DATA_FOR_PATHS, (data) => {
    submitData();
  });

  // Add event listeners.
  watcher
    .on('add', path => {
      console.log(`File ${path} has been added`)
      if(isLoaded) {
        submitData();
      }
    })
    .on('unlink', path => {
      console.log(`File ${path} has been removed`)
      if(isLoaded) {
        submitData();
      }
    });
  
  // More possible events.
  watcher
    .on('addDir', path => {
      console.log(`Directory ${path} has been added`)
      if(isLoaded) {
        submitData();
      }
    })
    .on('unlinkDir', path => {
      console.log(`Directory ${path} has been removed`)
      if(isLoaded) {
        submitData();
      }
    })
    .on('ready', () => {
      console.log('Initial scan complete. Ready for changes');
      isLoaded = true;
    })


  const submitData = () => {
    io.in(basePath).emit(LOAD_DATA_FOR_PATHS, getAllFiles(basePath, basePath));
  }
 
  // Leave the connection if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(basePath);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
