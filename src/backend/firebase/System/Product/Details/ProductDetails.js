import { database } from "../../../connection";
import { set,ref as dbRef } from "firebase/database";

const productStatus=async ()=>{
    try{
        const statusRef = dbRef(database, "System/Status");
        await set(statusRef, {
            0: 'Draft',
            1: 'Pending Review',
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}

const productVisibility=async ()=>{
    try{
        const prodRef = dbRef(database, "System/Visibility");
        await set(prodRef, {
            0: 'Public',
            1: 'Password Protected',
            2: 'Private',
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}
const catalogVisibility=async ()=>{
    try{
        const catRef = dbRef(database, "System/CategoryVisibility");
        await set(catRef, {
            0: 'Shop and search results',
            1: 'Shop only',
            2: 'Search results only',
            3: 'Hidden',
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}
const productData=async ()=>{
    try{
        const catRef = dbRef(database, "System/ProductType");
        await set(catRef, {
            0: 'Simple Product',
            1: 'Grouped Product',
            2: 'Externl/Affiliate Product',
            3: 'Variable Product',
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}
const taxing=async ()=>{
    try{
        const taxRef = dbRef(database, "System/TaxStatus");
        await set(taxRef, {
            0: 'Taxable',
            1: 'Shipping Only',
            2: 'None',
          });
          const taxClassRef = dbRef(database, "System/TaxClass");
          await set(taxClassRef, {
              0: 'Standard',
              1: 'VAT 19%',
            });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}
const productForm=async()=>{
    try{
        const statusRef = dbRef(database, "System/ProductForm");
        await set(statusRef, {
            0: 'Virtual',
            1: 'Downloadable',
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}
const productStockStatus=async()=>{
    try{
        const statusRef = dbRef(database, "System/StockStatus");
        await set(statusRef, {
            0: 'In Stock',
            1: 'Out Of Stock',
            2: 'On backorder'
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}

export {productVisibility,productStatus,catalogVisibility,productData,taxing,productForm,productStockStatus};