import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const LOAD_DATA_FOR_PATHS = "loadDataForPaths";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useSocket = (paths) => {
  const [pathList, setPathList] = useState([]);
  const [currentPathData, setCurrentPathData] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    // Load submitted path from localStorage ### Should be loaded from redux in the future
    const paths = JSON.parse(localStorage.getItem('paths') || '[]');
    socketRef.current = [];

    // Setup Socket Connection for every path
    paths.forEach(basePath => {
      const socket = socketIOClient(SOCKET_SERVER_URL, {
        query: { basePath },
      });

      // Trigger Initial Path Load Event
      socket.emit(LOAD_DATA_FOR_PATHS, {});

      // Receive Data for the Path
      socket.on(LOAD_DATA_FOR_PATHS, (data) => {
        let oldPathList = pathList;
        let findIndex = null;

        // Find the index for the received path
        oldPathList.forEach((list, index) => {
          if(list.name === basePath) {
            findIndex = index;

            // Replace old data with new one
            oldPathList[index] = data;
          }
        });

        // Add to the list if it's not here yet
        if(findIndex === null) {
          oldPathList.push(data);
        }

        setPathList(oldPathList);
        setCurrentPathData(data);
      });
      socketRef.current.push(socket);
    });
    return () => {
      // Trigger connection termination when the component is destroyed
      (socketRef.current || []).forEach(socket => {
        socket.disconnect();
      });
    };
  }, [paths]);

  return { currentPathData, pathList, setPathList };
};

export default useSocket;
