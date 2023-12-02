import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import style from './LogoutButton.module.css'

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className={style.logout}>
      Salir
    </button>
  );
};

export default LogoutButton;