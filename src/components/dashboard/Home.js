
import React from 'react'
 import './dashboard.css'
 import Dashboard from '../Admin/Home/Home';
import { useLocation } from 'react-router-dom';
import Products from '../Admin/Products/Products';
import Category from '../Admin/Category/Category';
import Customer from '../Admin/Customer/Customer';
import ProductForm from '../Admin/Products/ProductForm';
import Attribute from '../Admin/Attributes/Attribute';
import ConfigureAttribute from '../Admin/Attributes/ConfigureAttribute';
function Home() {
    const location=useLocation();
    const queryParams = new URLSearchParams(location.search);
    const locationUrl = queryParams.get('location');
    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];
      const ActiveTab=()=>{
        if(locationUrl=='products'){
          return(
            <Products></Products>
          )
        }else if(locationUrl=='dashboard'){
          return(
            <Dashboard></Dashboard>
          )
        }else if(locationUrl=='category'){
          return(
            <Category></Category>
          )
        }else if(locationUrl=='customer'){
          return(
            <Customer></Customer>
          )
        }else if(locationUrl=='productForm'){
          return(
            <ProductForm></ProductForm>
          )
        
        }else if(locationUrl=='configureAttribute'){
          return(
            <ConfigureAttribute></ConfigureAttribute>
          )
        }else if(locationUrl=='attributes'){
          return(
            <Attribute></Attribute>
          )
        }
      }
  return (
    <main className='main-container'>
        <ActiveTab></ActiveTab>
    </main>
  )
}

export default Home;