import { React, useState } from "react";
import style from "./SearchBar.module.css";
import { useDispatch } from "react-redux";
import { getPostByName, getStoreByName } from "../../redux/actions";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchString, setSearchString] = useState("");

  function handleChange(event) {
    setSearchString(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!location.hash.includes("/dashboard")) {
      navigate("/resultados");
    }
    try {
      await dispatch(getStoreByName(searchString));
      await dispatch(getPostByName(searchString));
      setSearchString("");
    } catch (error) {
      alert("No se encontraron resultados para la búsqueda.");
    }
  }

  return (
    <>
      <div className={style.searchBar}>
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            value={searchString}
            onChange={handleChange}
            placeholder="Busca una tienda o producto"
          />
          <button type="submit" className={style.all}>
            Ver todo
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchBar;
