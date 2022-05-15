import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Approve from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import Navbar from '../../components/Navbar';

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
        {
            field: 'pemail',
            headerName: 'Email',
            flex: 1,
        },
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
    const [modal, setModal] = useState(false);
    const [errMsg, setErrMsg] = useState({ msg: "", color: "" });

    const [selectedIDs, setSelectedIDs] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [displayOperations, setDisplayOperations] = useState(false);

    const token = localStorage.getItem("token");

    const getAppointments = async () => {
        if (token && token !== "") {
        await axios.get("http://localhost:5001/admin/getAppointments",
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
                }
                else setErrMsg({msg:res.data.msg, color:"red"})
            })
            .catch(err => navigate("/login", { state: { msg: "Unexpected Internal Error Occurred" } }, { replace: true }))
        }
        else navigate("/login", { state: { msg: "Session expired! Please login again" } }, { replace: true });
    }

    useEffect(() => {
        getAppointments();
    }, []);

    // if rows are selected then display the operations buttons
    useEffect(()=>{
        selectedIDs.length>0? setDisplayOperations(true): setDisplayOperations(false)
    }, [selectedIDs]);

    const performOperation = async (op) => {
        if (token && token !== "") {
            await axios.post("http://localhost:5001/admin/operation", { ids:selectedIDs, emails:selectedEmails,  op },
                {
                    headers: { "authorization": `Bearer ${token}`, 'Content-Type': 'application/json' },
                })
                .then(res => {
                    if(res.data.success===true)
                    {
                        alert(res.data.msg);
                        getAppointments();
                    }
                    else
                        alert(res.data.msg)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else navigate("/login", { state: { msg: "Session expired! Please login again" } }, { replace: true });
    }

    return (
        <>
        <Navbar/>
            <h1 className='text-center mt-3'>All Appointments</h1>
            <p className='fs-6 text-center fw-bold' style={{ color: errMsg.color }}>{errMsg.msg}</p>
            {displayOperations && 
                <section>
                    {/* for approving */}
                    <Button variant="contained" color="success" className="mx-4"
                        onClick={()=>performOperation("approve")} endIcon={<Approve/>}>Approve
                    </Button>
                    {/* for rejecting */}
                    <Button variant="contained" color="error"
                        onClick={()=>performOperation("reject")} endIcon={<CancelIcon />}>Reject
                    </Button>
                </section>
            }
            <div style={{ height: 500, width: '100%' }} className="px-4 mt-3">
                <DataGrid
                    columns={columns}
                    rows={data}
                    checkboxSelection
                    onSelectionModelChange={(ids) => {
                        setSelectedIDs(ids);
                        // getting email from ids as selection model only selects the ids
                        let Emails = data.map(row => {
                            if(ids.includes(row.id))
                                return row.pemail
                            return null
                        });
                        setSelectedEmails(Emails)
                      }}

                      selectionModel={selectedIDs}
                />
            </div>
        </>
    )
}

export default MyAppointments