import React from 'react';
import LogoutButton from '../../components/Auth0/LogoutButton'; // Assuming you have a component named LogoutButton
import { useAuth0 } from "@auth0/auth0-react";

const Account = ({ setAuth, userData }) => {
  const { user, logout } = useAuth0(); // Fix here: destructure 'logout' correctly

  const allLogOut = () => {
    localStorage.removeItem("token");
    setAuth(false);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <>
      <div>Soy la view de Account!</div>
      <button onClick={allLogOut}>Salir</button>
    </>
  );
};

export default Account;
