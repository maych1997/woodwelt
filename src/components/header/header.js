import React from "react";
import logo from '../../../src/assets/logo/woodwelteu-high-resolution-logo-transparent.png';
import './header.css'
const Header=()=>{
    return(
    <header className="header-class">
        <div className="logo-container">
            <img src={logo} className="logo" alt="logo" />
       </div>
    </header>
    );
}

export default Header;