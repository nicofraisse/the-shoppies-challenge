import React from 'react';
import MovieController from './containers/MovieController.js';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <a href="https://github.com/nicofraisse/the-shoppies-challenge" target="_blank" className="source-code">View source code</a>
      <MovieController />
    </div>
  );
}

export default App;
