import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import Logo from "../../assets/TLlogoAlpha.png";
import style from "./Navbar.module.css";

const Navbar = () => {
  return (
    <>
    <SearchBar />
    <div className={style.navbar}>
      <div className={style.logo}>
        <img src={Logo} alt="logo" />
      </div>
      <div className={style.search}>
        
      </div>
      <div className={style.directAccess}>
        <button>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/puffy/32/FFFFFF/experimental-home-puffy.png"
            alt="experimental-home-puffy"
          />
        </button>
        <button>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/windows/32/FFFFFF/like--v1.png"
            alt="like--v1"
          />
        </button>
        <button>
          <img
            width="32"
            height="32"
            src="https://img.icons8.com/sf-regular/48/FFFFFF/chat.png"
            alt="chat"
          />
        </button>
        <button>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/fluency-systems-regular/48/FFFFFF/user--v1.png"
            alt="user--v1"
          />
        </button>
        <button>
          <img
            width="32"
            height="32"
            src="https://img.icons8.com/pulsar-line/48/FFFFFF/connection-status-off.png"
            alt="connection-status-off"
          />
        </button>
      </div>
    </div>
    </>
  );
};

export default Navbar;
