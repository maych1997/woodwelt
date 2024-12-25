import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./product.css";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { get, ref as dbRef, onValue, remove } from "firebase/database";
import { database } from "../../../backend/firebase/connection";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { setAttributeNode, setProductAttributes } from "../../../store/Slice";
import DeleteDialog from "../../Dialog/Delete/Delete"; // Import the DeleteDialog

const options = ["Edit", "Delete"];
const ITEM_HEIGHT = 48;

const Products = () => {
  const productDetails = useSelector((state) => state.store);
  const [attributes, setAttributes] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // To store the selected product for deletion
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleClick = (event, rowId) => {
		setAnchorEl(event.currentTarget);
		setSelectedRowId(rowId);
	};

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAction = (action, params) => {
    if (action === "Delete") {
      setSelectedProduct(params); // Set the selected product for deletion
      setDeleteDialogOpen(true); // Open the delete dialog
    } else {
      navigate("/admin/dashboard?location=productForm", {
        state: { location: action, productData: params.row },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      const databaseRemove = dbRef(
        database,
        "products/" + selectedProduct.row.sku
      );
      remove(databaseRemove)
        .then(() => {
          setDeleteDialogOpen(false);
          window.location.reload();
          alert("Data removed successfully");
        })
        .catch((error) => {
          alert(error);
        });
    }
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
    { field: "productType", headerName: "Type", width: 130,renderCell:(params)=>{
      return(
        <>{params.row.productType.label}</>
      )
    } },
    {
      field: "category",
      headerName: "Category",
      width: 130,
      renderCell: (params) =>
        params?.value?.map((item, index) => {
          if (item == true) {
            return categories.length - 1 == index
              ? categories[index].categoryName
              : categories[index].categoryName + ", ";
          }
        }),
    },
    { field: "qty", headerName: "Quantity", width: 130 },
    {
      field: "color",
      headerName: "Color Code",
      width: 200,
      renderCell: (params) =>
        // !String(params?.row?.color?.colorCode)?.includes(",") ? (
          // <div
          //   style={{
          //     backgroundColor: params?.row?.color?.colorCode,
          //     height: 25,
          //     width: 40,
          //     border:
          //       String(params?.row?.color?.colorCode).length != 0
          //         ? "1px solid"
          //         : "0px",
          //   }}
          // ></div>
        // ) : (
        //   String(params?.row?.color?.colorCode)
        //     .split(",")
        //     .map((item) => (
        //       <div
        //         style={{
        //           backgroundColor: item,
        //           height: 25,
        //           width: 120,
        //           marginRight: 5,
        //           border: String(item).length != 0 ? "1px solid" : "0px",
        //         }}
        //       ></div>
        //     ))
        // ),
        Array.isArray(params.row.color)? params.row.color.map((item)=>{
          return(
          <div
          style={{
            backgroundColor: item?.colorCode,
            height: 25,
            width: 40,
            border:
              String(item?.colorCode).length != 0
                ? "1px solid"
                : "0px",
          }}
        ></div>
          )
        }):         <div
        style={{
          backgroundColor: params?.row?.color?.colorCode,
          height: 25,
          width: 40,
          border:
            String(params?.row?.color?.colorCode).length != 0
              ? "1px solid"
              : "0px",
        }}
      ></div>
    },
    {
      field: "colorName",
      headerName: "Color Name",
      width: 200,
      renderCell: (params) =>
      (
        !Array.isArray(params?.row?.color)?params?.row?.color?.name:params?.row?.color.map((item,index)=>{
          return(
            params?.row?.color.length-1==index? item.name:item.name + ','
          )
        })
      )
    },
    {
      field: "multiColor",
      headerName: "Multi Color",
      width: 200,
      renderCell: (params) =>(
        !Array.isArray(params?.row?.multiColor)?params?.row?.multiColor?.multiColor?.map((item) => (
        <div
          style={{
            backgroundColor: item,
            height: 25,
            width: 120,
            border: String(item).length != 0 ? "1px solid" : "0px",
          }}
        ></div>
      )):params?.row?.multiColor?.map((item)=>{
        return(
        item?.multiColor?.map((item) => (
          <div
            style={{
              backgroundColor: item,
              height: 25,
              width: 120,
              border: String(item).length != 0 ? "1px solid" : "0px",
            }}
          ></div>
          ))
        )
        })
    )
    },
    {
      field: "size",
      headerName: "Size",
      width: 200,
      renderCell: (params) =>
        (
          !Array.isArray(params?.row?.size)?params?.row?.size?.name:params?.row?.size.map((item,index)=>{
            return(
              params?.row?.size.length-1==index? item.name:item.name + ','
            )
          })
        )
    },
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
      renderCell: (params) => {
        // Ensure params.value is defined and is an array
        const values = Array.isArray(params?.value)
          ? params.value
          : [undefined, undefined];

        const [firstValue, secondValue] = values;

        if (firstValue === true && secondValue === true) {
          return "Virtual, Downloadable";
        } else if (
          firstValue === true &&
          (secondValue === false || secondValue === undefined)
        ) {
          return "Virtual";
        } else if (
          firstValue === false ||
          (firstValue === undefined && secondValue === true)
        ) {
          return "Downloadable";
        } else {
          return "N/A";
        }
      },
    },
    {
      field: "taxClass",
      headerName: "Tax Class",
      width: 130,
      renderCell: (params) => {
        return params.value.label;
      },
    },
    {
      field: "taxStatus",
      headerName: "Tax Status",
      width: 130,
      renderCell: (params) => {
        return params.value.label;
      },
    },

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
						onClick={(event) => handleClick(event, params.row.id)}
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
						open={Boolean(anchorEl) && selectedRowId === params.row.id}
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
                selected={option}
                onClick={() => {
                  handleAction(option, params);
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      ),
    },
  ];

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
    const fetchCategories = async () => {
      try {
        const productRef = dbRef(database, "category/");
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const categoryArray = Object.keys(data).map((key, index) => ({
            id: index,
            ...data[key],
          }));
          setCategories(categoryArray);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchCategories();
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

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        handleDelete={handleDeleteConfirm}
        content={"Are you sure you want to delete this product?"}
      />
    </div>
  );
};

export default Products;
