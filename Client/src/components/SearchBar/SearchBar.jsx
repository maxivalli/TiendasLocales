import { React, useState } from "react";
import style from "./SearchBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { filterByName, getStoreByName } from "../../redux/actions";

const SearchBar = () => {
  const dispatch = useDispatch();

  const allStores = useSelector((state) => state.allStores)
  const allPosts = useSelector((state) => state.allPosts)

  const [searchString, setSearchString] = useState("");

  function handleChange(event) {
    setSearchString(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await dispatch(getStoreByName(searchString));
      setSearchString("");
      dispatch(filterByName(searchString));
    } catch (error){
      throw error
      alert("No se encontraron resultados para la búsqueda.");
    }
  }

  return (
    <>
     <form onSubmit={handleSubmit}>
      <div className={style.searchBar}>
        <input
          type="search"
          placeholder="Busca una tienda o producto"
          value={searchString}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </div>
      </form>
    </>
  );
};

export default SearchBar;
