import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Button, TextField } from '@mui/material';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

let schema = yup.object().shape({
    pname: yup.string().required("Please enter your name"),
    // pemail: yup.string().email().required("Please provide a email"),
    phone: yup.number().required("Please enter a contact no"),
    // appointmentDate: yup.date().required("Please enter a date"),
    // slot: yup.string().required("Please select a slot").oneOf(["morning", "evening"]),
    appointmentType: yup.string().required("Please select your appointment type").oneOf(["normal", "vaccination"]),
    id: yup.number(),
});

const columns =
    [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
        },
        {
            field: 'pname',
            headerName: 'Name',
            flex: 1,
        },
        // {
        //     field: 'pemail',
        //     headerName: 'Email',
        //     flex: 1,
        // },
        {
            field: 'phone',
            headerName: 'Contact No.',
            flex: 1,
        },
        {
            field: 'appointmentType',
            headerName: 'Type',
            flex: 1,
        },
        {
            field: 'slot',
            headerName: 'Slot',
            flex: 1,
        },
        {
            field: 'token',
            headerName: 'Token No.',
            flex: 1,
        },
        {
            field: 'appointmentDate',
            headerName: 'Appointment Date',
            flex: 1,
        },
        {
            field: 'statusInfo',
            headerName: 'Status',
            flex: 1,
        },
    ]

const MyAppointments = () => {

    const navigate = useNavigate();
    
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modal, setModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [errMsg, setErrMsg] = useState({ msg: "", color: "" });
    const [estimatedTime, setEstimatedTime] = useState(false);

    const token = localStorage.getItem("token");

    const getAppointments = async () => {
        if (token && token !== "") {
        await axios.get("http://localhost:5001/user/getAppointments",
            {
                headers: { "authorization": `Bearer ${token}`, 'Content-Type': 'application/json' },
            })
            .then(res => {
                if (res.data.success === true) 
                {
                    setData(res.data.data);

                    // checking the status of each user and updating it acc to the status code
                    const newData = res.data.data.map((obj, index)=>{
                        if(obj.status===0)
                            return {...obj, statusInfo:"Pending"}

                        else if(obj.status===1)
                            return {...obj, statusInfo:"Approved"}

                        else if(obj.status===-1)
                            return {...obj, statusInfo:"Rejected"}

                        else 
                            return {...obj, statusInfo:"Invalid Appointment"}
                    })
                    setData(newData);

                    if(res?.data?.timings === true) setEstimatedTime(true);
                }
                else setErrMsg({
                    msg: res.data.msg,
                    color: "red"
                })
            })
            .catch(err => navigate("/login", { state: { msg: "Unexpected Internal Error Occurred" } }, { replace: true }))
        }
        else navigate("/login", { state: { msg: "Session expired! Please login again" } }, { replace: true });
    }





    useEffect(() => {
        getAppointments();
    }, []);





    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedRow(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }




    const handleRowSelect = (row) => {
        setSelectedRow({ ...row });
        setEdit(true);
    }





    const UpdateRow = () => {

        setErrMsg({
            msg: "Please wait, updating the data",
            color: "#333"
        })
        if (token && token !== "") {
            schema.validate(selectedRow)
                .then(async (res) => {

                    await axios.post("http://localhost:5001/user/updateAppointment", { data: res }, 
                    {
                        headers: { "authorization": `Bearer ${token}`, 'Content-Type': 'application/json'},
                    })
                        .then(res => {
                            if (res.data.success === true) {
                                getAppointments();
                                setErrMsg({
                                    msg: "",
                                    color: ""
                                })
                            }
                            else {
                                setErrMsg({
                                    msg: res.data.msg,
                                    color: "red"
                                })
                            }
                        })
                        .catch(err => {
                            navigate("/login", { state: { msg: "Unexpected Internal Error Occurred" } }, { replace: true })
                        })
                })
                .catch(err => setErrMsg({
                    msg: err.message,
                    color: "red"
                }))
        }
        else navigate("/login", { state: { msg: "Session expired! Please login again" } }, { replace: true });
        
        setModal(false);
        setEdit(false);
        setSelectedRow(null);
    }






    return (
        <>
            <h1 className='text-center mt-3'>Your Appointments</h1>
            <p className='fs-6 text-center fw-bold mb-3'>Select the row and click on Edit button twice to edit the appointment</p>
            <div className="px-3 appointment_status_wrapper d-flex justify-content-start flex-wrap">
            {   
                estimatedTime === true &&
                data.map((app,index)=>{
                    if(app.status ==1 || app.status ==0)
                    {
                        return (<>
                            {/* appointment status div */}
                                <div key={index}  className="toast show mx-2 my-4" role="alert" aria-live="assertive" aria-atomic="true" >
                                    <div className="toast-header">
                                        <strong className="me-auto">{app?.appointmentType}</strong>
                                        <small>Token: {app?.token}</small>
                                    </div>
                                    <div className="toast-body">
                                        Hello, your appointment on <span className="fw-bold"> {app?.appointmentDate}</span> is estimately scheduled at
                                        <span className="fw-bold"> {app?.time?.hour}:{app?.time?.minutes}</span>.
                                    </div>
                                </div>
                                {/* * */}
    
                        </>)
                    }
                })
            }
            </div>
            <p className='fs-6 text-center fw-bold' style={{ color: errMsg.color }}>{errMsg.msg}</p>

            {/* edit button */}
            <div style={{ height: 500, width: '100%' }} className="px-4 mt-3">
                {edit &&
                    <button className="btn btn-primary fs-6" data-bs-toggle={modal === true ? "modal" : ""} data-bs-target="#staticBackdrop"
                        onClick={() => { setModal(true) }}>Edit <EditIcon /></button>}
                <DataGrid
                    columns={columns}
                    rows={data}
                    onRowClick={({ row }) => { handleRowSelect(row) }}
                />
            </div>

            {/* modal */}
            {modal === true ?
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="px-2 py-3 d-flex flex-column align-items-center">

                                <TextField fullWidth id="standard-error-helper-text" label="ID" disabled variant="standard" className='ip_field' name="aid" value={selectedRow.id} />
                                <br />

                                <TextField fullWidth id="standard-error-helper-text" label="Name" variant="standard" className='ip_field' name="pname" value={selectedRow.pname}
                                    onChange={handleChange} />
                                <br />

                                {/* <TextField fullWidth id="standard-error-helper-text" label="Email" variant="standard" className='ip_field' name="pemail" value={selectedRow.pemail}
                                    onChange={handleChange} />
                                <br /> */}

                                <TextField fullWidth id="standard-error-helper-text" label="Phone" variant="standard" className='ip_field' name="phone" value={selectedRow.phone}
                                    onChange={handleChange} />
                                <br />

                                <TextField fullWidth id="standard-error-helper-text" label="Appointment Type" variant="standard" className='ip_field' name="appointmentType" value={selectedRow.appointmentType} onChange={handleChange} />
                                <br />

                                {/* <TextField fullWidth id="standard-error-helper-text" label="Slot" variant="standard" className='ip_field' name="slot" value={selectedRow.slot} onChange={handleChange} />
                                <br /> */}

                                {/* <TextField fullWidth type="date" id="standard-error-helper-text" name="appointmentDate" onChange={handleChange} variant="standard" className='ip_field' value={selectedRow.date} /> */}
                            </div>

                            <div className='modal-footer d-flex justify-content-around'>
                                <Button variant="contained" color="success" data-bs-dismiss="modal" onClick={UpdateRow}>Update</Button>
                                <Button variant="outlined" color="error" data-bs-dismiss="modal" onClick={() => { setModal(false) }}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
                :
                ""
            }
        </>
    )
}

export default MyAppointments