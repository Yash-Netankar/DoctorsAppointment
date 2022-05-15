import React, {useContext} from 'react'
import {useLocation, Navigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/authContext';

const ProtectedRouteAdmin = ({children}) => {

    const {login} = useContext(LoginContext);
    const location = useLocation();
    console.log(login)
    
    if(login.isLogin===false || (login.role!=="admin" && login.role!=="doctor"))
    {
        return <Navigate to="/login" state={{msg: "Not Authorized", prevPath:location.pathname }} replace={true} />
    }

    return children
}

export default ProtectedRouteAdmin