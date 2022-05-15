import React, { useState, createContext } from 'react';

export const LoginContext = createContext({});

const LoginContextProvider = (props) => {
    const [login, setLogin] = useState({
        isLogin:false,
        role:null
    });

  return (
    <LoginContext.Provider value={{login, setLogin}}>
        {props.children}
    </LoginContext.Provider>
  )
}

export {LoginContextProvider};