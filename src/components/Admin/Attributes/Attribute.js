import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Select, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { get, ref as dbRef, set, push, remove } from "firebase/database";
import { database } from "../../../backend/firebase/connection";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteDialog from "../../Dialog/Delete/Delete";
import { useSelector } from "react-redux";

const options = ["Configure Terms", "Edit", "Delete"];
const ITEM_HEIGHT = 48;

const Attribute = () => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const productAttributes = useSelector(
		(state) => state.store.productAttributes
	);
	const [name, setName] = useState();
	const [slug, setSlug] = useState();
	const [type, setType] = useState(0);
	const [selectedRowId, setSelectedRowId] = useState(null);
	const [attributes, setAttributes] = useState([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [attributeToDelete, setAttributeToDelete] = useState(null);

	const handleClick = (event, rowId) => {
		setAnchorEl(event.currentTarget);
		setSelectedRowId(rowId);
	};

	const handleDeleteConfirm = async () => {
		if (attributeToDelete) {
			const productRef = dbRef(database, "attributes/");
			const snapshot = await get(productRef);
			if (snapshot.exists()) {
				const databaseRemove = dbRef(
					database,
					"attributes/" + Object.keys(snapshot.val())[attributeToDelete.id]
				);
				try {
					await remove(databaseRemove);
					setAnchorEl(null);
					setSelectedRowId(null);
					setDeleteDialogOpen(false);
					window.location.reload();
					alert("Data removed successfully");
				} catch (error) {
					alert(error);
				}
			}
		}
	};

	const handleClose = async (action, attribute) => {
		setAnchorEl(null);
		if (action === "Delete" && attribute.id === selectedRowId) {
			setAttributeToDelete(attribute);
			setDeleteDialogOpen(true);
		} else if (action === "Configure Terms" && attribute.id === selectedRowId) {
			const productRef = dbRef(database, "attributes/");
			const snapshot = await get(productRef);
			if (snapshot.exists()) {
				navigate("/admin/dashboard?location=configureAttribute", {
					state: {
						row: Object.values(snapshot.val())[attribute.id],
						nodeId: Object.keys(snapshot.val())[attribute.id],
					},
				});
			}
		}
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
				params?.row?.terms != undefined && params?.row?.slug == "color"
					? Object.values(params?.row?.terms).map((item, index) => (
							<div className="color-text-container" key={index}>
								<p className="color-text">{item?.name}</p>
								:
								<div
									style={{
										backgroundColor: item?.colorCode,
										width: "30px",
										height: "20px",
										border: "1px solid",
									}}
								/>
							</div>
					  ))
					: params?.row?.terms != undefined && params?.row?.slug == "size"
					? Object.values(params.row.terms).map((item, index) => (
							<div className="color-text-container" key={index}>
								<p className="color-text">{item?.name}</p>
							</div>
					  ))
					: "No Terms Added",
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 90,
			renderCell: (params) => (
				<div>
					<IconButton
						aria-label="more"
						id="long-button"
						aria-controls={anchorEl ? "long-menu" : undefined}
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
								onClick={() => handleClose(option, params.row)}
							>
								{option}
							</MenuItem>
						))}
					</Menu>
				</div>
			),
		},
	];

	const addAttribute = async () => {
		try {
			const ref = dbRef(database, "attributes/");
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
						onChange={(event) => setName(event.target.value)}
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
						onChange={(event) => setSlug(event.target.value)}
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
						onChange={(event) => setType(event.target.value)}
						size="small"
					>
						{productAttributes?.Attributes?.map((item, index) => (
							<MenuItem key={index} value={index}>
								{item}
							</MenuItem>
						))}
					</Select>
				</div>
				<button className="add-product-button" onClick={addAttribute}>
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

			<DeleteDialog
				open={deleteDialogOpen}
				handleClose={() => setDeleteDialogOpen(false)}
				handleDelete={handleDeleteConfirm}
				content={`Are you sure you want to delete the attribute "${attributeToDelete?.name}"?`}
			/>
		</div>
	);
};

export default Attribute;
