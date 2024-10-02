import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useFetchCategory from "../../../backend/firebase/System/Product/Category/FetchCategory";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../../backend/firebase/connection";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;
const Category = () => {
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
    { field: "id", headerName: "ID", width: 20 },
    { field: "slug", headerName: "Slug", width: 130 },
    { field: "categoryName", headerName: "Category Name", width: 130 },
    { field: "description", headerName: "Description", width: 200 },
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
  useFetchCategory();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productRef = ref(database, "category/");
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
  }, []);
  return (
    <div className="productContainer">
      <div className="main-title">
        <h3>Category</h3>
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
              navigate("/admin/dashboard?location=categoryForm");
            }}
          >
            Add Category
          </button>
        </div>
      </div>
      <DataGrid
        rows={categories}
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

export default Category;
