// src/hooks/useFetchProductDetails.js
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { database } from "../../../connection";
import { onValue, ref } from "firebase/database";
import { setAttributeNode, setProductAttributes } from "../../../../../store/Slice";

const useFetchProductAttributes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData=()=>{
        const nodeRef = ref(database, "System/");
    
        const unsubscribeData = onValue(nodeRef, (snapshot) => {
          const data = snapshot.val();
          console.log(data);
          dispatch(setProductAttributes(data));
        }, (error) => {
          console.error("Error fetching product details:", error);
          // Handle error state here if needed
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribeData();
    }
    const fetchNodeIds=()=>{
      const nodeRef = ref(database, "attributes/");
  
      const unsubscribeData = onValue(nodeRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(setAttributeNode(data));
      }, (error) => {
        console.error("Error fetching product details:", error);
        // Handle error state here if needed
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribeData();
  }
    fetchNodeIds();
    fetchData();
  }, []);
};

export default useFetchProductAttributes;
