import React from "react";
import {
	BsFillBellFill,
	BsFillEnvelopeFill,
	BsPersonCircle,
	BsSearch,
	BsJustify,
} from "react-icons/bs";
import "./dashboard.css";
import UserMenu from "./UserMenu";
function header({ OpenSidebar }) {
	return (
		<header className="header">
			<div className="menu-icon">
				<BsJustify
					className="icon"
					onClick={() => {
						OpenSidebar();
					}}
				/>
			</div>
			<div className="header-right">
				<BsFillBellFill className="icon" />
				<BsFillEnvelopeFill className="icon" />
				{/* <BsPersonCircle className="icon" /> */}
				<UserMenu />
			</div>
		</header>
	);
}

export default header;
