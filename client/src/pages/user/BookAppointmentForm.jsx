import React, { useState } from 'react'
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import * as yup from 'yup';
import axios from 'axios';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const materialModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

let schema = yup.object().shape({
    pname: yup.string().required("Please enter your name"),
    // pemail: yup.string().email().required("Please provide a email"),
    phone: yup.number().required("Please enter a contact no"),
    date: yup.date().required("Please enter a date"),
    slot: yup.string().required("Please select a slot").oneOf(["morning", "evening"]),
    AppointmentType: yup.string().required("Please select your appointment type").oneOf(["normal", "emergency", "vaccination"]),
});

const BookAppointmentForm = () => {

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [appointmentBookedMsg, setAppointmentBookedMsg] = useState("");

    const [errMsg, setErrMsg] = useState({
        msg: "",
        color: ""
    });

    const [data, setData] = useState({
        pname: "",
        phone: "",
        date: "",
        slot: "",
        AppointmentType: "",
    });

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setData(prev=>{
            return{
                ...prev,
                [name]:value
            }
        })
    }

    const setError = (msg, color)=>{
        setErrMsg({
            msg:msg,
            color:color
        })
    }

    const BookAppointment = () => {
        setError("Please wait, booking your appointment", "#333");

        const token = localStorage.getItem("token");
        if (token && token !== "") {
            schema.validate(data)
                .then(async (res) => {
                    await axios.post("http://localhost:5001/user/bookAppointment", { data, id }, 
                    {
                        headers: { "authorization": `Bearer ${token}`, 'Content-Type': 'application/json' },
                    })
                        .then(res => {
                            if (res.data.success === true) {
                                setAppointmentBookedMsg(res.data.msg);
                                setOpen(true);
                            }
                            else setError(res.data.msg, "red")
                        })
                        .catch(err => {
                            navigate("/login", { state: { msg: "Unexpected Internal Error Occurred" } }, { replace: true })
                        })
                })
                .catch(err => setError(err.message, "red"))
        }
        else navigate("/login", { state: { msg: "Session expired! Please login again" } }, { replace: true });
    }

    return (
        <>
            <Navbar />
            <div className='BookAppointmentForm_wrapper container-fluid d-flex align-items-center justify-content-center'>
                <div className="bookAppointmentForm d-flex flex-column mt-5">
                    <h4 className="text-center">Book Your Appointment Now With {searchParams.get("name")} </h4>
                    <p className='fs-6 text-center fw-bold' style={{ color: errMsg.color }}>{errMsg.msg}</p>

                    <TextField id="standard-error-helper-text" label="Your Name" name="pname" onChange={handleChange} variant="standard" className='ip_field' />

                    <TextField type="number" id="standard-error-helper-text" label="Your Phone" onChange={handleChange} name="phone" variant="standard" className='ip_field' />

                    <div className='mt-4 mb-4'>
                        <p className='fs-6'>Select a appointment date</p>
                        <TextField type="date" id="standard-error-helper-text" name="date" onChange={handleChange} variant="standard" className='w-100'/>
                    </div>

                    <select className="form-select" aria-label="Default select example" name="slot" onChange={handleChange}>
                        <option defaultValue={true}>Select a slot</option>
                        <option className="fs-6" value="morning">Morning</option>
                        <option className="fs-6" value="evening">Evening</option>
                    </select>

                    <select className="form-select" aria-label="Default select example" name="AppointmentType" onChange={handleChange}>
                        <option defaultValue={true}>Select a appointment type</option>
                        <option className="fs-6" value="normal">Normal</option>
                        <option className="fs-6" value="vaccination">Vaccination</option>
                        <option className="fs-6" value="emergency">Emergency</option>
                    </select>

                    <Button variant="contained" color="success" className="bookBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">Book Now</Button>

                </div>
            </div>

            {/* modal */}
            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="fs-6 mb-4">Are You Sure You Want To Book Your Appointment With {searchParams.get("name")}.</p>
                        </div>

                        <div className='modal-footer d-flex justify-content-around'>
                            <Button variant="contained" onClick={BookAppointment} data-bs-dismiss="modal" color="success">Book Now</Button>
                            <Button variant="outlined" color="error" data-bs-dismiss="modal">Cancel</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* material modal after appointment is booked */}
            <Modal
                hideBackdrop
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...materialModalStyle }}>
                    <h2 id="child-modal-title">{appointmentBookedMsg}</h2>
                    <p id="child-modal-description" className='fs-6'>
                        Please visit your doctor, {searchParams.get("name")} on time.
                    </p>
                    <div className='d-flex justify-content-between'>
                        <NavLink to="/myappointments">
                            <Button variant="contained">View Appointments</Button>
                        </NavLink>
                        <Button variant="outlined" color="error" onClick={() => setOpen(false)}>Close</Button>
                    </div>
                </Box>
        </Modal>
        </>
    )
}

export default BookAppointmentForm;