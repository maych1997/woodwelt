import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import "./delete.css";

const DeleteDialog = ({ open, handleClose, handleDelete }) => {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="delete-dialog-title"
			aria-describedby="delete-dialog-description"
		>
			<DialogContent>
				<DialogContentText id="delete-dialog-description">
					Are you sure you want to delete this category?
				</DialogContentText>
			</DialogContent>
			<DialogActions id="buttons-container">
				<Button onClick={handleClose} variant="outlined" color="primary">
					Cancel
				</Button>
				<Button
					onClick={handleDelete}
					variant="outlined"
					color="error"
					autoFocus
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteDialog;
