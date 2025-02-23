import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Singup";

export default function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>}/>

        <Route path="dashboard" element={''}>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}