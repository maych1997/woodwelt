// src/hooks/useFetchProductDetails.js
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { database } from "../../../connection";
import { onValue, ref } from "firebase/database";
import { setProductDetails } from "../../../../../store/Slice";

const useFetchProductDetails = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData=()=>{
        const nodeRef = ref(database, "System/");
    
        const unsubscribeData = onValue(nodeRef, (snapshot) => {
          const data = snapshot.val();
          dispatch(setProductDetails(data));
        }, (error) => {
          console.error("Error fetching product details:", error);
          // Handle error state here if needed
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribeData();
    }
    fetchData();
  }, []);
};

export default useFetchProductDetails;
