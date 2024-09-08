import Login from "./components/pages/login/login";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ForgotPassword from "./components/pages/forgotPassword/forgotPassword";
import Register from "./components/pages/register/register";
import Dashboard from "./components/dashboard/Dashboard";
import PersonalDetails from "./components/pages/personalDetails/personalDetails";
import NotFound from "./components/pages/notfound/notfound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route exact path="/admin/login" element={<Login />}></Route>
        <Route
          path="/admin/forgot-password"
          element={<ForgotPassword />}
        ></Route>
        <Route path="/admin/register" element={<Register />}></Route>
        <Route path="/admin/dashboard" element={<Dashboard />}></Route>
        <Route
          path="/admin/personalDetails"
          element={<PersonalDetails />}
        ></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
