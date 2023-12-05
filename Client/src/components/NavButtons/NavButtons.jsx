import React from "react";
import style from './NavButtons.module.css'

const NavButtons = () => {
  return (
    <>
      <button className={style.chat}>
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/parakeet-line/48/chat.png"
          alt="chat"
        />
      </button>
      <button className={style.nav}>
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/material-outlined/48/near-me.png"
          alt="near-me"
        />
      </button>
    </>
  );
};

export default NavButtons;
