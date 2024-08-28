import Login from "./components/pages/login/login";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ForgotPassword from "./components/pages/forgotPassword/forgotPassword";
import Register from "./components/pages/register/register";
import Dashboard from "./components/dashboard/Dashboard";
import Products from '../src/components/Admin/Products/Products'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/admin/login" element={<Login />}></Route>
          <Route path="/admin/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/admin/register" element={<Register />}></Route>
          <Route path="/admin/dashboard" element={<Dashboard/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
