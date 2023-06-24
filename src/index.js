import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Redirector from './Redirector';
import App from './App';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/:id" element={<Redirector />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
