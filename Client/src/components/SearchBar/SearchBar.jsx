import { React, useState } from "react";
import style from "./SearchBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  filterByName,
  getPostByName,
  getStoreByName,
} from "../../redux/actions";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allStores = useSelector((state) => state.allStores);
  const allPosts = useSelector((state) => state.allPosts);

  const [searchString, setSearchString] = useState("");

  function handleChange(event) {
    setSearchString(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    navigate("/resultados");
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
