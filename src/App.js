import Login from "./components/pages/login/login";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ForgotPassword from "./components/pages/forgotPassword/forgotPassword";
import Register from "./components/pages/register/register";
import Dashboard from "./components/dashboard/Dashboard";
import PersonalDetails from "./components/pages/personalDetails/personalDetails";
import NotFound from "./components/pages/notfound/notfound";
import {catalogVisibility, productData, productForm, productStatus,productStockStatus,productVisibility, taxing} from './backend/firebase/System/Product/Details/ProductDetails'

import { useEffect } from "react";
import ProductForm from "./components/Admin/Products/ProductForm";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {

  useEffect(()=>{
    productStatus();
    productVisibility();
    catalogVisibility();
    productData();
    taxing();
    productForm();
    productStockStatus();
  },[]);
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
