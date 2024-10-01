import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./attributes.css";
import { Select, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { get, ref as dbRef, set, push } from "firebase/database";
import { database } from "../../../backend/firebase/connection";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useFetchProductAttributes from "../../../backend/firebase/System/Product/Attributes/FetchProductAttributes";
import { useSelector } from "react-redux";
import { click } from "@testing-library/user-event/dist/click";

const options = ["Configure Terms", "Edit", "Delete"];

const ITEM_HEIGHT = 48;
const Attribute = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const productAttributes = useSelector(
    (state) => state.store.productAttributes
  );
  const attributeNode = useSelector((state) => state.store.attributeNode);
  const [name, setName] = useState();
  const [slug, setSlug] = useState();
  const [type, setType] = useState(0);
  const [row, setRow] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "name", headerName: "Name", width: 300 },
    { field: "slug", headerName: "Slug", width: 300 },
    { field: "type", headerName: "Type", width: 300 },
    {
      field: "terms",
      headerName: "Terms",
      width: 300,
      renderCell: (params) =>
        params.row.terms != undefined && params.row.slug == "color"
          ? Object.values(params.row.terms).map((item, index) => {
              return (
                <div className="color-text-container">
                  <p className="color-text" key={index}>
                    {item?.name}
                  </p>
                  :
                  <div
                    style={{
                      backgroundColor: item.colorCode,
                      width: "30px",
                      height: "20px",
                      border:'1px solid'
                    }}
                  ></div>
                </div>
              );
            })
          : params.row.slug == "size"
          ? Object.values(params.row.terms).map((item, index) => {
              return (
                <div className="color-text-container">
                  <p className="color-text" key={index}>
                    {item?.name}
                  </p>
                </div>
              );
            })
          : "",
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      width: 300,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => {
              handleClick(event);
              setRow(params.row);
            }}
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
                selected={option === "Configure Terms"}
                onClick={() => {
                  alert(Object.keys(attributeNode)[row.id]);
                  navigate("/admin/dashboard?location=configureAttribute", {
                    state: {
                      row: row,
                      nodeId: Object.keys(attributeNode)[row.id],
                    },
                  });
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
  const [attributes, setAttributes] = useState([]);
  const addAttribute = async () => {
    try {
      const ref = dbRef(database, "attributes/");
      // Check if the user data already exists
      const attributeRef = push(ref);
      await set(attributeRef, {
        name: name,
        slug: slug,
        type: productAttributes.Attributes[type],
      });
      window.location.reload();
      alert("Product " + name + " added successfully");
    } catch (error) {
      alert(error);
    }
  };
  useFetchProductAttributes();
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const productRef = dbRef(database, "attributes/");
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const attributeArray = Object.keys(data).map((key, index) => ({
            id: index,
            ...data[key],
          }));
          setAttributes(attributeArray);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchAttributes();
  }, []);
  return (
    <div className="attributeContianer">
      <h3>Attributes</h3>
      <div className="shipping-details">
        <div>
          <div className="headingContainer">
            <h6>Name</h6>
          </div>
          <TextField
            className="text-input"
            id="name"
            size="small"
            label="Name"
            variant="outlined"
            type="text"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>
        <div>
          <div className="headingContainer">
            <h6>Slug</h6>
          </div>
          <TextField
            className="text-input"
            id="slug"
            size="small"
            label="Slug"
            variant="outlined"
            type="text"
            onChange={(event) => {
              setSlug(event.target.value);
            }}
          />
        </div>
        <div>
          <div className="headingContainer">
            <h6>Type</h6>
          </div>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            className="text-input"
            value={type}
            onChange={(event) => {
              setType(event.target.value);
            }}
            size="small"
          >
            {productAttributes?.Attributes?.map((item, index) => {
              return (
                <MenuItem key={index} value={index}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <button
          className="add-product-button"
          onClick={() => {
            addAttribute();
          }}
        >
          Add Attribute
        </button>
      </div>
      <div className="main-title">
        <div className="action-container">
          <TextField
            className="search"
            size="small"
            id="search"
            label="Search"
            variant="outlined"
          />
          <button className="add-product-button">Filter</button>
        </div>
      </div>
      <DataGrid
        rows={attributes}
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

export default Attribute;
