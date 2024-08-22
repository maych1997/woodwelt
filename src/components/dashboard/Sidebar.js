import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'
 import './dashboard.css'
 import logo from '../../assets/images/login-wallpaper.jpg'
import { useNavigate } from 'react-router-dom';
function Sidebar({openSidebarToggle, OpenSidebar}) {
    const navigate=useNavigate();
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div onClick={()=>{navigate('/dashboard?location=dashboard')}} className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3  className='icon_header'/> Woodwelt.eu
            </div>
            <span className='icon close_icon' onClick={()=>{OpenSidebar()}}>X</span>
        </div>
        <div className='profileCard'>
            <div className='profilePicture'>
                <img src={logo}></img>
                <p>Muhammad Arslan Yousaf</p>
                <p>yousafarslan09@gmail.com</p>
                <p>03474077976</p>
            </div>
        </div>
        <ul className='sidebar-list'>
            <li onClick={()=>{navigate('/dashboard?location=dashboard')}} className='sidebar-list-item'>
                    <BsGrid1X2Fill className='icon'/> Dashboard
            </li>
            <li onClick={()=>{navigate('/dashboard?location=products')}} className='sidebar-list-item'>
                    <BsFillArchiveFill className='icon'/> Products
            </li>
            <li onClick={()=>{navigate('/dashboard?location=category')}} className='sidebar-list-item'>
                    <BsFillGrid3X3GapFill className='icon'/> Categories
            </li>
            <li onClick={()=>{navigate('/dashboard?location=customer')}} className='sidebar-list-item'>
                    <BsPeopleFill className='icon'/> Customers
            </li>
            <li className='sidebar-list-item'>
                    <BsListCheck className='icon'/> Inventory
            </li>
            <li className='sidebar-list-item'>
                    <BsMenuButtonWideFill className='icon'/> Reports
            </li>
            <li className='sidebar-list-item'>
                    <BsFillGearFill className='icon'/> Setting
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar;
