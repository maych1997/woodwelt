import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./attributes.css";
import { Select, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { get, ref as dbRef, set, push } from "firebase/database";
import { database } from "../../../backend/firebase/connection";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useFetchProductAttributes from "../../../backend/firebase/System/Product/Attributes/FetchProductAttributes";
import { useSelector } from "react-redux";
import { HexColorPicker } from "react-colorful";

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;
const ConfigureAttribute = () => {
  const location = useLocation();
  const data = location.state.row;
  const nodeId = location.state.nodeId;
  const [color, setColor] = useState("#000");
  const [savedColor, setSavedColor] = useState("#000");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const colorList = useSelector((state) => state.store.attributeArray);
  const [name, setName] = useState();
  const [slug, setSlug] = useState();
  const [type, setType] = useState(0);
  const [colorPallete, showColorPallete] = useState(false);
  const [size, setSize] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns =
    data?.slug == "color"
      ? [
          { field: "id", headerName: "ID", width: 300 },
          { field: "name", headerName: "Name", width: 300 },
          { field: "slug", headerName: "Slug", width: 300 },
          { field: "colorCode", headerName: "Color Code", width: 300 },
          {
            field: "color",
            headerName: "Color",
            width: 300,
            renderCell: (params) => {
              return (
                <div
                  style={{
                    backgroundColor: params.row.color,
                    height: 25,
                    width: 40,
                  }}
                ></div>
              );
            },
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
        ]
      : data.slug == "size"
      ? [
          { field: "id", headerName: "ID", width: 300 },
          { field: "name", headerName: "Name", width: 300 },
          { field: "size", headerName: "Size", width: 300 },
          { field: "slug", headerName: "Slug", width: 300 },
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
        ]
      : "";

  const [attributes, setAttributes] = useState([]);
  const addAttribute = async () => {
    if (data.slug == "color") {
      try {
        const ref = dbRef(database, "attributes/" + nodeId + "/terms");
        // Check if the user data already exists
        const attributeRef = push(ref);
        await set(attributeRef, {
          name: name,
          slug: slug,
          colorCode: savedColor,
          color: savedColor,
        });
        window.location.reload();
        alert("Attribute " + name + " added successfully");
      } catch (error) {
        alert(error);
      }
    } else if (data?.slug == "size") {
      try {
        const ref = dbRef(database, "attributes/" + nodeId + "/terms");
        // Check if the user data already exists
        const attributeRef = push(ref);
        await set(attributeRef, {
          name: name,
          slug: slug,
          size: size,
        });
        window.location.reload();
        alert("Attribute " + name + " added successfully");
      } catch (error) {
        alert(error);
      }
    }
  };
  useFetchProductAttributes();
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const productRef = dbRef(database, "attributes/" + nodeId + "/terms");
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
  console.log(attributes);
  return (
    <div className="attributeContianer">
      {data?.slug == "color" ? (
        <>
          <h3>Configure {data.name}</h3>
          <div className="shipping-details">
            <div>
              <div className="headingContainer">
                <h6>Select Color</h6>
              </div>
              <div className="color-heading">
                <h6>Code: {color}</h6>
              </div>
              <div
                className="color"
                style={{
                  height: 25,
                  width: 40,
                  backgroundColor: color,
                  border: "1px solid",
                }}
                onClick={() => {
                  showColorPallete(!colorPallete);
                }}
              ></div>
              {colorPallete == true ? (
                <div>
                  <HexColorPicker
                    style={{ marginTop: 20 }}
                    onChange={setColor}
                  />
                  <button
                    style={{ marginTop: 10 }}
                    onClick={() => {
                      setSavedColor(color);
                      showColorPallete(!colorPallete);
                    }}
                    className="add-product-button"
                  >
                    Save
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
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
              <TextField
                className="text-input"
                id="slug"
                size="small"
                label="Color Code"
                variant="outlined"
                type="text"
                value={savedColor}
                onChange={(event) => {
                  setSavedColor(event.target.value);
                }}
              />
            </div>
            <button
              className="add-product-button"
              onClick={() => {
                if (color != savedColor) {
                  alert("Please Select and Save the color");
                } else {
                  addAttribute();
                }
              }}
            >
              Add Color
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
        </>
      ) : data?.slug == "size" ? (
        <>
          <h3>Configure {data.name}</h3>
          <div className="shipping-details">
            <div>
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
              <TextField
                className="text-input"
                id="name"
                size="small"
                label="Size"
                variant="outlined"
                type="text"
                onChange={(event) => {
                  setSize(event.target.value);
                }}
              />
            </div>
            <div>
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
            <button
              className="add-product-button"
              onClick={() => {
                if (color != savedColor) {
                  alert("Please Select and Save the color");
                } else {
                  addAttribute();
                }
              }}
            >
              Add Size
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
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ConfigureAttribute;
