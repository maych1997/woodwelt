import { database } from "../../../connection";
import { set,ref as dbRef } from "firebase/database";

const attributes=async ()=>{
    try{
        const statusRef = dbRef(database, "System/Attributes");
        await set(statusRef, {
            0: 'Color',
            // 1: 'Image',
            1: 'Button',
            // 3: 'Radio'
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}
const sortOrder=async ()=>{
    try{
        const statusRef = dbRef(database, "System/Sort");
        await set(statusRef, {
            0: 'Custom Ordering',
            1: 'Name',
            2: 'Name (Numeric)',
            3: 'Term ID'
          });
    }
    catch(error){
        alert('Something Went Wrong! Check Status Details.');
    }
}

export {attributes,sortOrder};