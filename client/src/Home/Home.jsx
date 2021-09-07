import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

import "./Home.css";
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [paths, setPaths] = React.useState([]);
  const [path, setPath] = React.useState('');

  const handlePathChange = (event) => {
    setPath(event.target.value);
  };

  const handleDelete = (deletedIndex) => {
    setPaths(paths.filter((path, index) => index !== deletedIndex));
  }
  
  // Add new tag to the list when user type 'Enter' on input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setPaths(prev => ([...prev, path]));
      setPath('');
    }
  }

  // When user click `Load Path` button
  const onLoadPaths = () => {
    localStorage.setItem('paths', JSON.stringify(paths));
  }
  return (
    <div className="home-container">
      <Paper component="ul" className={classes.root}>
        {paths.map((data, index) => {
          return (
            <li key={index}>
              <Chip
                className={classes.ship}
                label={data}
                onDelete={() => handleDelete(index)}
                style={{ margin: 5 }}
              />
            </li>
          );
        })}
      </Paper>
      <input
        type="text"
        placeholder="Path"
        value={path}
        onChange={handlePathChange}
        onKeyDown={handleKeyDown}
        className="text-input-field"
      />
      <Link to={`/explorer`} className="enter-room-button" onClick={onLoadPaths}>
        Load Paths
      </Link>
    </div>
  );
};

export default Home;
