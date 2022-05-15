import React, {useContext} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/main.css";
import HomePage from './pages/user/HomePage';
import Erorr404 from './pages/Erorr404';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Doctors from './pages/user/Doctors';
import BookAppointmentForm from './pages/user/BookAppointmentForm';
import MyAppointments from './pages/user/MyAppointments';
import Appointments from './pages/admin/Appointments';

import { LoginContext, LoginContextProvider } from "./contexts/authContext.js";
import ProtectedRoute from './pages/auth/ProtectedRoute';
import ProtectedRouteAdmin from './pages/auth/ProtectedRouteAdmin';

const App = () => {
  const login = useContext(LoginContext);

  return (
    <LoginContextProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/bookAppointment/:id' 
                element={<ProtectedRoute>
                      <BookAppointmentForm />
                    </ProtectedRoute>}/>

          <Route path='/doctors' 
                element={<ProtectedRoute>
                      <Doctors />
                    </ProtectedRoute>}/>

          <Route path='/myappointments' 
                element={<ProtectedRoute>
                    <MyAppointments />
                  </ProtectedRoute>}>
          </Route>

          {/* Admin routes */}
          <Route path='/admin/appointments' 
                element={<ProtectedRouteAdmin>
                    <Appointments />
                  </ProtectedRouteAdmin>
          } />

        <Route path='*' element={<Erorr404 />} />
      </Routes>
    </BrowserRouter>
    </LoginContextProvider >
  )
}

export default App