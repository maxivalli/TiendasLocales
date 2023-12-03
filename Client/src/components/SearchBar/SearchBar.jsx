import { React } from "react";
import style from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <>
      <div className={style.searchBar}>
        <input type="search" placeholder="Busca una tienda o producto" />
      </div>
    </>
  );
};

export default SearchBar;
