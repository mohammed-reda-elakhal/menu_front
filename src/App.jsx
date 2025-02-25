import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import { Suspense } from 'react';
import './i18n';


export default function App() {
  return (
      <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>}/>
        
        
      </Routes>
    </BrowserRouter>
  )
}