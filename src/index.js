import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import StarRating from './StarRating';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* <StarRating maxRating={5} />
    <StarRating maxRating={10} /> */}
    <App />
  </React.StrictMode>
)