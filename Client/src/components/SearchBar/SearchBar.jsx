import React from "react";
import Logo from "../../assets/TLlogoAlpha.png";
import style from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <>
      <div className={style.background}>
        <img src={Logo} alt="logo" className={style.logo} />
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/ios-filled/50/FFFFFF/appointment-reminders--v1.png"
          alt="appointment-reminders--v1"
          className={style.bell}
        />
      </div>
      <div className={style.searchBar}>
        <input type="text" placeholder="Ingresa una tienda o producto" />
        <button>
          <img
            width="32"
            height="32"
            src="https://img.icons8.com/glyph-neue/64/FFFFFF/search--v1.png"
            alt="search--v1"
          />
        </button>
      </div>
    </>
  );
};

export default SearchBar;
