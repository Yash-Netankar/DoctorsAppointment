import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import doctorImg from "../../styles/images/doctor.png";
import axios from 'axios';

const Doctors = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([
        {
            id: "1",
            name: "John Doe",
            successRate: "4.2",
            location: "ABC complex, NY, USA",
            speciality: "Heart and Skin Care",
            education: "MBBS",
            desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, non veniam excepturi necessitatibus sit enim fugit. Minima vel deserunt officiis amet provident, inventore ut laborum fugit minus pariatur accusamus dolores, obcaecati, soluta quod rem. Veniam dignissimos ad nulla cumque quia perspiciatis a, recusandae nihil quisquam aspernatur dolorem! Fuga, qui id."
        },
    ]);

    const getDoctors = async () => {
        const token = localStorage.getItem("token");
        if (token && token !== "") {
            await axios.get("http://localhost:5001/user/getDoctors",
                {
                    headers: { "authorization": `Bearer ${token}`, 'Content-Type': 'application/json' }
                })
                .then(res => {
                if (res.data.success === true) {
                    setData(res.data.data);
                }
                else navigate("/login" ,{replace:true}, { state: { msg: res.data.msg } });
            })
            .catch(err => {
                navigate("/login", { state: { msg: "Unexpected Internal Error Occurred" } }, { replace: true })
            })
        }
        else navigate("/login", { state: { msg: "Session expired! Please login again" } }, { replace: true });
    }

    useEffect(() => {
        getDoctors();
    }, []);

    return (
        <div className='allDoctors_wrapper container-fluid p-0 pb-5'>
            <Navbar />
            {
                data.map((doctor, i) => {
                    return (
                        <div className="doctor_card col-12 col-xxl-8 col-xl-8 col-md-10 d-flex align-items-stretch" key={i}>

                            <div className="section1 px-2 col-4">
                                <div className="text-center">
                                    {doctorImg && <img src={doctorImg} alt={`doctor ${doctor.name}`} />}
                                </div>
                                <p className="text-center name fs-2"><span className="underline">{doctor.name}</span></p>
                                <p className="degree fw-bold">{doctor.education}</p>
                                <p className="speciality fw-bold">{doctor.speciality}</p>
                                <p className="ratings fw-bold">Ratings: {doctor.successRate}</p>
                            </div>

                            <div className="section2 col-8 py-2">
                                <div className="about">
                                    <span className="fs-5 fw-bold">About</span>
                                    <p className='desc'>{doctor.desc}</p>
                                </div>

                                <p className="location"><span className="fw-bold d-block">Location</span> {doctor.location}</p>

                                <NavLink to={`/bookAppointment/${doctor.did}?name=${doctor.name}`} style={{ textDecoration: "none" }}>
                                    <Button variant="contained" className="bookAppointmentBtn">Book Appointment</Button>
                                </NavLink>
                            </div>

                        </div>
                    )
                })
            }
        </div>
    )
}

export default Doctors