import React, {useContext} from 'react'
import {useLocation, Navigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/authContext'

const ProtectedRoute = ({children}) => {

    const {login} = useContext(LoginContext);
    const location = useLocation();

    if(login.isLogin===false || login.role!=="user")
    {
        return (<Navigate to="/login" state={{msg: "Please login to continue", prevPath:location.pathname }} replace={true} />)
    }

    return children
}

export default ProtectedRoute