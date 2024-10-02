import { database } from "../../../connection";
import { set,ref as dbRef } from "firebase/database";

const category=async ()=>{
    try{
        const statusRef = dbRef(database, "System/Category/CategoryVisibility");
        await set(statusRef, {
            0: 'Default',
            1: 'Products',
            2: 'Subcategories',
            3: 'Both'
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}

export {category};