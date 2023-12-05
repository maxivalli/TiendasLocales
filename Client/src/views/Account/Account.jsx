import React, { useState, useEffect } from 'react';
import LogoutButton from '../../components/Auth0/LogoutButton'; // Assuming you have a component named LogoutButton
import { useAuth0 } from "@auth0/auth0-react";
import UbiForm from '../../components/UbiForm/UbiForm';
import { useNavigate } from "react-router-dom";

const Account = ({ setAuth, userData }) => {
  const { user, logout } = useAuth0(); // Fix here: destructure 'logout' correctly
  const [formStatus, SetFormStatus] = useState(false) 
  const navigate = useNavigate()

  const allLogOut = () => {
    localStorage.removeItem("token");
    setAuth(false);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  useEffect(()=>{
    if(formStatus === true){
      navigate("/ubiForm")
    }
  },[formStatus])

  return (
    <>
      <div>Soy la view de Account!</div>
      <button onClick={()=>{SetFormStatus(true)}}>Direccion de Envios</button>
      {formStatus && <UbiForm userData={userData}/>}
      <button onClick={allLogOut}>Salir</button>
    </>
  );
};

export default Account;
