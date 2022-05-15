import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginContext } from "../contexts/authContext.js";

const Navbar = () => {

  const navigate = useNavigate();
  const { login, setLogin } = useContext(LoginContext);

  const Logout = () => {
    localStorage.removeItem("token");
    setLogin({isLogin:false, role:null});
    navigate("/login", { replace: true });
  }

  return (
    <nav className="d-flex justify-content-between align-items-center px-2 py-2">
      <div className="logo d-flex align-items-center">
        <h2>LOGO</h2>
      </div>

      <div className="links_div d-flex align-items-center">
        <ul className="d-flex align-items-center">

          <NavLink to="/" className="nav_link">Home</NavLink>
          {
              login.role === null || login.role === "user"?
              <NavLink to="/myappointments" className="nav_link">My Appointments</NavLink>
              :
              <NavLink to="/admin/appointments" className="nav_link">All Appointments</NavLink>
          }

          {/* <NavLink to="/services" className="nav_link">Services</NavLink> */}
          <NavLink to="/about" className="nav_link">About</NavLink>
          <NavLink to="/contact" className="nav_link">Contact</NavLink>
          {
            login.isLogin ?
              <Button variant="contained" style={{ backgroundColor: "#d82148" }} className="mx-2" onClick={Logout}>Logout</Button>
              :
              <Button variant="contained" style={{ backgroundColor: "#6bcb77" }} className="mx-2"
                onClick={() => navigate("/login")}>Login</Button>
          }
        </ul>
      </div>
    </nav>
  )
}

export default Navbar