import React from "react";
import { Link } from 'react-router-dom';
import Logo from "../../assets/TLlogoAlpha.png";
import style from "./Navbar.module.css";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = ({ isAuthenticated, setAuth, userData }) => {
  const { user, isAuthenticated: isAuthenticatedAuth0, logout: loguotAuth0 } = useAuth0();
  return (
    <>
    <div className={style.navbar}>
      <Link to="/home" className={style.toHome}>
      <div className={style.logo}>
        <img src={Logo} alt="logo" />
      </div>
      </Link>
      <div className={style.search}>
        </div>
      <div className={style.directAccess}>
        <Link to="/home">
        <button>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/puffy/32/FFFFFF/experimental-home-puffy.png"
            alt="experimental-home-puffy"
          />
        </button>
        </Link>
        <Link to="/favorites">
        <button>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/windows/32/FFFFFF/like--v1.png"
            alt="like--v1"
          />
        </button>
        </Link>
        <Link to="/messages">
        <button>
          <img
            width="32"
            height="32"
            src="https://img.icons8.com/sf-regular/48/FFFFFF/chat.png"
            alt="chat"
          />
        </button>
        </Link>
        <Link to="/account">
        {isAuthenticated || isAuthenticatedAuth0 ? (
          <button className={style.profilePicture}>
            <img src={(user && user.picture) || (userData && userData.image)} className={style.profilePicture}></img>
          </button>
        ) : (
          <button className={style.iconos}>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/fluency-systems-regular/48/FFFFFF/user--v1.png"
              alt="Usuario"
            />
          </button>
        )}
        </Link>
        <Link to="/more">
        <button>
          <img
            width="32"
            height="32"
            src="https://img.icons8.com/pulsar-line/48/FFFFFF/connection-status-off.png"
            alt="connection-status-off"
          />
        </button>
        </Link>
      </div>
    </div>
    </>
  );
};

export default Navbar;
