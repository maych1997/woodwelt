// src/hooks/useFetchProductDetails.js
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { database } from "../../../connection";
import { onValue, ref } from "firebase/database";
import { setCategoryVisibility } from "../../../../../store/Slice";


const useFetchCategory = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategory=()=>{
        const nodeRef = ref(database, "System/Category/CategoryVisibility");
    
        const unsubscribeData = onValue(nodeRef, (snapshot) => {
          const data = snapshot.val();
          dispatch(setCategoryVisibility(data));
        }, (error) => {
          console.error("Error fetching product details:", error);
          // Handle error state here if needed
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribeData();
    }
    fetchCategory();
  }, []);
};

export default useFetchCategory;
