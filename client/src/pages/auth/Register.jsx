import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import { NavLink } from "react-router-dom";
import * as yup from 'yup';

let schema = yup.object().shape({
    name: yup.string().required("Please enter your name"),
    email: yup.string().email().required("Please provide a email"),
    pass: yup.string().required("Please enter a password"),
    cpass: yup.string().oneOf([yup.ref('pass'), null], 'Passwords must match'),
    phone: yup.number().required("Please enter a contact no"),
});

const Regsiter = () => {

    const [errMsg, setErrMsg] = useState({
        msg: "",
        color: ""
    });

    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        pass: "",
        cpass: ""
    });

    const updateData = (e) => {
        let { name, value } = e.target;

        setData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }


    const setError = (msg, color)=>{
        setErrMsg({
            msg:msg,
            color:color
        })
    }


    const Register = () => {

        setError("Please wait, signing you up", "#333");

        schema.validate(data)
            .then(async (res) => {
                await axios.post("http://localhost:5001/auth/register", { data })
                    .then(res => {
                        if (res.data.success === true) {
                            setError(res.data.msg, "green");
                            setData({
                                name: "",
                                email: "",
                                phone: "",
                                pass: "",
                                cpass: ""
                            });
                        }
                        else setError(res.data.msg, "red")
                    })
                    .catch(err => {
                        setError("Internal Server Error Occurred", "red")
                    })
            })
            .catch(err => setError(err.message, "red"))
    }

    return (
        <div className="register_wrapper">
            <h1 className="text-center mb-5">
                <p className="underline d-inline">Sign Up</p>
            </h1>
            <div className="register_container container d-flex justify-content-between p-0">

                <div className="section1 py-3 col-xxl-6 col-xl-6 col-md-8 col-12 align-self-stretch d-flex flex-column">
                    <p className='fs-6 text-center fw-bold' style={{ color: errMsg.color }}>{errMsg.msg}</p>

                    <TextField id="standard-basic1" className="mt-5 ip_feild" name="name" label="Name" variant="standard" onChange={updateData} />

                    <TextField id="standard-basic2" className="ip_feild" name="email" label="Email" variant="standard" onChange={updateData} />

                    <TextField id="standard-basic3" className="ip_feild" name="phone" label="Contact No" variant="standard" onChange={updateData} />

                    <TextField id="standard-basic4" className="ip_feild" name="pass" type={"password"} label="Password" variant="standard" onChange={updateData} />

                    <TextField id="standard-basic5" className="ip_feild" name="cpass" type={"password"} label="Confirm Password" variant="standard" onChange={updateData} />

                    <Button variant="contained" className="w-50 register_btn mx-auto mt-3" onClick={Register}>Sign Up</Button>

                    <p className="text-secondary mt-2 text-center">Already Regsitered? <NavLink to="/login">Sign In</NavLink></p>
                </div>

                <div className="section2 col-xxl-4 col-xl-4 col-md-4 col-12 align-self-stretch">0</div>
            </div>
        </div>
    )
}

export default Regsiter