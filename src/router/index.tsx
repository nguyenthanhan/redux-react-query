import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "../pages/Main";
import Blog from "../pages/Blog/index";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
