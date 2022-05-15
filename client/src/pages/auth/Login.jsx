import React, {useEffect, useState, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {NavLink, useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import * as yup from 'yup';
import {LoginContext} from "../../contexts/authContext.js";

let schema = yup.object().shape({
    email: yup.string().email().required("Please give a email"),
    pass: yup.string().required("Please enter a password"),
  });

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {setLogin, login} = useContext(LoginContext);

    useEffect(()=>{
        const redirectionMsg = location?.state?.msg;
        redirectionMsg && setError(redirectionMsg,"red");
    },[])

    const [data, setData] = useState({
        email:"",
        pass:""
    });

    const [errMsg, setErrMsg] = useState({
        msg:"",
        color:""
    });


    const updateData = (e)=>{
        let {name, value} = e.target;

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


    const SignIn = ()=>{
        
        setError("Please wait, logging you in", "#333");

        schema.validate(data)
        .then(async (res)=>{

            await axios.post("http://localhost:5001/auth/login", {email:res.email, pass:res.pass})
            .then(res=>{
                if(res.data.success===true)
                {
                    setLogin({isLogin:true, role:res.data.role});
                    localStorage.setItem("token", res.data.token);

                    res.data.role==="admin" ? navigate("/admin/appointments", {replace:true}) :
                    location?.state?.prevPath ?
                        (navigate(location.state.prevPath, {replace:true})) : (navigate("/", {replace:true}));
                }
                else setError(res.data.msg, "red")
            })
            .catch(err=>{
                setError("Internal Server Error Occurred", "red")
            })
        })
        .catch(err=> setError(err.message, "red"))
    }

    return (
        <div className='loggin_wrapper'>
            <h1 className="text-center mb-5">
                <p className="underline d-inline">Sign In</p>
            </h1>
            <div className="login_container container d-flex justify-content-between p-0">

                <div className="section1 py-3 col-xxl-6 col-xl-6 col-md-8 col-12 align-self-center d-flex flex-column">
                    <p className='fs-6 text-center fw-bold' style={{color:errMsg.color}}>{errMsg.msg}</p>

                    <TextField id="standard-basic1" className="ip_feild" name="email" label="Email" variant="standard" onChange={updateData}/>

                    <TextField id="standard-basic2" className="ip_feild" name="pass" type={"password"} label="Password" variant="standard" onChange={updateData}/>

                    <Button variant="contained" className="w-50 login_btn mx-auto mt-3" onClick={SignIn}>Sign In</Button>

                    <p className="text-secondary mt-2 text-center">Not Yet Regsitered? <NavLink to="/register">Sign Up</NavLink></p>
                </div>

                <div className="section2 col-xxl-4 col-xl-4 col-md-4 col-12 align-self-stretch">0</div>
            </div>
        </div>
    )
}

export default Login