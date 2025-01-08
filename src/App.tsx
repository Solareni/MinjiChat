// App.tsx
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Route, Routes, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export const routes = [
  { path: "/", element: <Home />, label: "Home" },
  { path: "/about", element: <About />, label: "About" },
  { path: "/contact", element: <Contact />, label: "Contact" },
];

const App: React.FC = () => {
  const getRoute = (route: { path: string; element: JSX.Element }) => (
    <Route key={route.path} path={route.path} element={route.element} />
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <Sidebar />

      {/* 路由内容 */}
      <div className="flex-1 p-8 bg-white/20 backdrop-blur-md shadow-lg m-6 rounded-lg">
        <Routes>{routes.map(getRoute)}</Routes>
      </div>
    </div>
  );
};

export default App;

// Home.js
function Home() {
  return (
    <div className="text-4xl font-bold text-white animate-fade-in">
      Welcome to the Home Page!
    </div>
  );
}

// About.js
function About() {
  return (
    <div className="text-4xl font-bold text-white animate-fade-in">
      About Us
    </div>
  );
}

// Contact.js
function Contact() {
  return (
    <div className="text-4xl font-bold text-white animate-fade-in">
      Contact Us
    </div>
  );
}
