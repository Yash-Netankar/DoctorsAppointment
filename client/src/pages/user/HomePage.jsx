import React from 'react';
import Navbar from '../../components/Navbar';
import Button from "@mui/material/Button";

// images
import bg from "../../styles/images/landingbg2.png";
import { NavLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className='home_bg container-fluid px-2 d-flex justify-content-center align-items-center'>

        <div className="section1 d-flex flex-column justify-content-center col-12 col-xxl-4 col-xl-4 col-md-6">
          <h2 className='text-light mb-1'>We Are Committed To Your Health</h2>
          <h5 className="text-secondary mb-2">Professionals in Health Care</h5>
          <p className="fw-light mb-1 lh-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel iure, veritatis recusandae odio officia atque? Facilis nisi nobis aliquid iusto! Quibusdam quo architecto ratione saepe at quos? Doloremque maiores ab tempore id ipsum dicta. Exercitationem eligendi quasi pariatur veniam vel expedita, nemo eaque! Optio in sint unde debitis atque vero!
          </p> 
          <h6 className="fw-bold text-success mb-3">
            Emergency: 880-xx-xxx-12
          </h6>
          <NavLink to="/doctors" style={{textDecoration:"none"}}>
            <Button variant="contained" className="bookAppointment_btn w-75">Book Appointment <i className="mx-2 bi bi-calendar-check"></i></Button>
          </NavLink>
        </div>

        <div className="section2 col-12 col-xxl-7 col-xl-7 col-md-6 d-flex justify-content-end">
            <div className="img_div">
            <img src={bg} alt="background img" className='bg'/>
            </div>
        </div>

      </div>
    </>
  )
}

export default HomePage