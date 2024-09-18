import React from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import App from './App'; // Or './app.jsx' if that's your file name

ReactDOM.render( // Use ReactDOM.render
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') 
);