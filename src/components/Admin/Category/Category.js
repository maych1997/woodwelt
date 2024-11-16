// Category.js
import React, { useEffect, useState } from "react";
import {
	TextField,
	IconButton,
	Menu,
	MenuItem,
	ClickAwayListener,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import { get, ref as dbRef, remove } from "firebase/database";
import { database } from "../../../backend/firebase/connection";
import useFetchCategory from "../../../backend/firebase/System/Product/Category/FetchCategory";
import DeleteDialog from "../../Dialog/Delete/Delete";

const options = ["Edit", "Delete"];
const ITEM_HEIGHT = 48;

const Category = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [anchorEl, setAnchorEl] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedRowId, setSelectedRowId] = useState(null);
	const [categories, setCategories] = useState([]);

	useFetchCategory();

	const handleClick = (event, rowId) => {
		setAnchorEl(event.currentTarget);
		setSelectedRowId(rowId);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleDeleteConfirm = () => {
		const databaseRemove = dbRef(
			database,
			"category/" + selectedCategory?.slug
		);
		remove(databaseRemove)
			.then(() => {
				setDeleteDialogOpen(false);
				setSelectedCategory(null);
				setSelectedRowId(null);
				window.location.reload();
				alert("Data removed successfully");
			})
			.catch((error) => {
				alert(error);
			});
	};

	const handleMenuOptionClick = (option, category) => {
		if (option === "Delete") {
			setSelectedCategory(category);
			setDeleteDialogOpen(true);
		} else if (option === "Edit") {
			navigate("/admin/dashboard?location=categoryForm", {
				state: {
					editMode: true,
					categoryData: category,
				},
			});
		}
		handleCloseMenu();
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 20 },
		{ field: "slug", headerName: "Slug", width: 130 },
		{ field: "categoryName", headerName: "Category Name", width: 130 },
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
					<ClickAwayListener onClickAway={handleCloseMenu}>
						<Menu
							id="long-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl) && selectedRowId === params.row.id}
							onClose={handleCloseMenu}
							PaperProps={{
								style: {
									maxHeight: ITEM_HEIGHT * 4.5,
									width: "20ch",
								},
							}}
						>
							{options.map((option) => (
								<MenuItem
									key={option}
									onClick={() => handleMenuOptionClick(option, params.row)}
								>
									{option}
								</MenuItem>
							))}
						</Menu>
					</ClickAwayListener>
				</div>
			),
		},
	];

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const productRef = dbRef(database, "category/");
				const snapshot = await get(productRef);
				if (snapshot.exists()) {
					const categoriesData = snapshot.val();
					const formattedCategories = Object.keys(categoriesData).map(
						(key) => ({
							id: key,
							slug: categoriesData[key].slug,
							categoryName: categoriesData[key].categoryName,
						})
					);
					setCategories(formattedCategories);
				}
			} catch (error) {
				console.error("Error fetching categories:", error);
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
						onClick={() => navigate("/admin/dashboard?location=categoryForm")}
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
			<DeleteDialog
				open={deleteDialogOpen}
				handleClose={() => setDeleteDialogOpen(false)}
				handleDelete={handleDeleteConfirm}
				content={"Are you sure you want to delete this category?"}
			/>
		</div>
	);
};

export default Category;
