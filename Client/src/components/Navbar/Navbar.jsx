import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/TLlogoAlpha.png";
import home from "../../assets/home.png";
import heart from "../../assets/heart.png";
import chat from "../../assets/chat.png";
import more from "../../assets/more.png";
import style from "./Navbar.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserStore } from "../../redux/actions";

const Navbar = ({ isAuthenticated, setAuth }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userData);
  const userStore = useSelector((state) => state.userStore);
  const [showAccounts, setShowAccounts] = useState();

  const selectAccount = () => {
    setShowAccounts(false);
  };

  const {
    user,
    isAuthenticated: isAuthenticatedAuth0,
    logout: loguotAuth0,
  } = useAuth0();

  const toggleAccounts = () => {
    if (showAccounts) {
      setShowAccounts(false);
    }
    if (!showAccounts) {
      setShowAccounts(true);
    }
  };

  const handleClick = () => {
    if (location.hash.startsWith("#/messages")) {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <>
      <div className={style.navbar}>
        <Link to="/inicio" className={style.toHome}>
          <div className={style.logo}>
            <img src={Logo} alt="logo" />
          </div>
        </Link>
        <div className={style.search}></div>
        <div className={style.directAccess}>
          <Link to="/inicio">
            <button>
              <img
                width="28"
                height="28"
                src={home}
                alt="home"
              />
            </button>
          </Link>
          <Link to="/favoritos">
            <button>
              <img
                width="32"
                height="32"
                src={heart}
                alt="favoritos"
              />
            </button>
          </Link>
          {userStore ? (
            <button onClick={toggleAccounts}>
              <img
                width="28"
                height="28"
                src={chat}
                alt="chat"
              />
            </button>
          ) : (
            <Link to="/mensajes/usuario">
              <button>
                <img
                  width="28"
                  height="28"
                  src={chat}
                  alt="chat"
                />
              </button>
            </Link>
          )}
          {showAccounts && (
            <div className={style.modal}>
              <h3>Selecciona una una cuenta para chatear</h3>
              <div className={style.accounts}>
                <Link to="/mensajes/usuario">
                  <button
                    onClick={() => {
                      handleClick();
                      selectAccount();
                    }}
                    className={style.profilePicture}
                  >
                    <img
                      src={
                        (user && user.picture) || (userData && userData.image)
                      }
                      className={style.profilePicture}
                      alt="user"
                    />
                  </button>
                </Link>

                <Link to="/mensajes/tienda">
                  <button
                    onClick={() => {
                      handleClick();
                      selectAccount();
                    }}
                    className={style.profilePicture}
                  >
                    <img
                      src={userStore && userStore.image}
                      className={style.profilePicture}
                      alt="store"
                    />
                  </button>
                </Link>
              </div>
            </div>
          )}

          <Link to="/micuenta">
            {isAuthenticated || isAuthenticatedAuth0 ? (
              <button className={style.profilePicture}>
                <img
                  src={(user && user.picture) || (userData && userData.image)}
                  className={style.profilePicture}
                ></img>
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
          <Link to={`/mitienda/${userStore.id}`}>
          {userStore && (
            <button>
              <img src={userStore && userStore.image} className={style.profilePicture} />
            </button>
          )}
          </Link>
          <Link to="/mas">
            <button>
              <img
                width="28"
                height="28"
                src={more}
                alt="mas"
              />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
