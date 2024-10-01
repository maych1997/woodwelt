import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./product.css";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { get, ref as dbRef, onValue } from "firebase/database";
import { database } from "../../../backend/firebase/connection";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { setAttributeNode, setProductAttributes } from "../../../store/Slice";

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;
const Products = () => {
  const productDetails = useSelector((state) => state.store);
  const [attributes, setAttributes] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 130,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Product"
          style={{ width: "50px", height: "auto", objectFit: "cover" }}
        />
      ),
    },
    { field: "id", headerName: "ID", width: 20 },
    { field: "sku", headerName: "SKU", width: 130 },
    { field: "productName", headerName: "Product Name", width: 130 },
    { field: "description", headerName: "Product Description", width: 200 },
    { field: "shortDescription", headerName: "Short Description", width: 200 },
    { field: "stockStatus", headerName: "Stock Status", width: 130 },
    { field: "productType", headerName: "Type", width: 130 },
    // { field: "category", headerName: "Category", width: 130 },
    { field: "qty", headerName: "Quantity", width: 130 },
    { field: "color", headerName: "Color", width: 130 },
    {
      field: "colorCode",
      headerName: "Color Code",
      width: 130,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: params.row.colorCode,
            height: 25,
            width: 40,
            border: params.row.colorCode.length != 0 ? "1px solid" : "",
          }}
        ></div>
      ),
    },
    { field: "size", headerName: "Size", width: 130 },
    {
      field: "salePrice",
      headerName: "Sale Price",
      type: "number",
      width: 130,
    },
    {
      field: "regularPrice",
      headerName: "Regular Price",
      type: "number",
      width: 130,
    },
    {
      field: "productForm",
      headerName: "Product Form",
      width: 150,
      renderCell: (params) =>
        params?.value[0] == true && params?.value[1] == true
          ? "Virtual , Downloadable"
          : (params?.value[0] == true && params?.value[1] == false) ||
            params.value[1] == undefined
          ? "Virtual"
          : params?.value[0] == false ||
            (params?.value[0] == undefined && params?.value[1] == true)
          ? "Downloadable"
          : "N/A",
    },
    { field: "taxClass", headerName: "Tax Class", width: 130 },
    { field: "taxStatus", headerName: "Tax Status", width: 130 },

    // {
    //   field: "inventory",
    //   headerName: "Inventry",
    //   type: "number",
    //   width: 90,
    // },
    // {
    //   field: "availability",
    //   headerName: "Availability",
    //   type: "number",
    //   width: 90,
    // },
    // {
    //   field: "color",
    //   headerName: "Color", //Multiple Color Selection
    //   type: "number",
    //   width: 90,
    // },
    // {
    //   field: "size",
    //   headerName: "Size", //s,m,l,xl,xxl
    //   type: "number",
    //   width: 90,
    // },
    // {
    //   field: "dimensions",
    //   headerName: "Dimensions", //s,m,l,xl,xxl
    //   type: "number",
    //   width: 90,
    // },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      width: 90,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <div className="threeDots">
              <div className="dots"></div>
              <div className="dots"></div>
              <div className="dots"></div>
            </div>
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={handleClose}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      ),
    },
  ];

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productRef = dbRef(database, "products/");
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const productArray = Object.keys(data).map((key, index) => ({
            id: index,
            ...data[key],
          }));
          setProducts(productArray);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchData = () => {
      const nodeRef = dbRef(database, "System/");

      const unsubscribeData = onValue(
        nodeRef,
        (snapshot) => {
          const data = snapshot.val();
          console.log(data);
          dispatch(setProductAttributes(data));
        },
        (error) => {
          console.error("Error fetching product details:", error);
          // Handle error state here if needed
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribeData();
    };
    const fetchNodeIds = () => {
      const nodeRef = dbRef(database, "attributes/");

      const unsubscribeData = onValue(
        nodeRef,
        (snapshot) => {
          const data = snapshot.val();
          dispatch(setAttributeNode(data));
        },
        (error) => {
          console.error("Error fetching product details:", error);
          // Handle error state here if needed
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribeData();
    };
    fetchNodeIds();
    fetchData();
    fetchProducts();
  }, []);
  return (
    <div className="productContainer">
      <div className="main-title">
        <h3>PRODUCTS</h3>
        <div className="action-container">
          <TextField
            className="search"
            size="small"
            id="search"
            label="Search"
            variant="outlined"
          />
          <button className="add-product-button">Filter</button>
          <button
            className="add-product-button"
            onClick={() => {
              navigate("/admin/dashboard?location=productForm");
            }}
          >
            Add Product
          </button>
        </div>
      </div>
      <DataGrid
        rows={products}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default Products;
