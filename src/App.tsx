import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';
import { BrowserRouter,  Route } from "react-router-dom";
import { Users } from './Components/Users';
function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={Users} />
    </BrowserRouter>
  );
}

export default App;
