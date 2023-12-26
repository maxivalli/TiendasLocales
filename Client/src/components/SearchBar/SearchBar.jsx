import { React, useState } from "react";
import style from "./SearchBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { filterByName, getStoreByName } from "../../redux/actions";

const SearchBar = () => {
  const dispatch = useDispatch();

  const allStores = useSelector((state) => state.allStores);
  const allPosts = useSelector((state) => state.allPosts);

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
    } catch (error) {
      throw error;
      alert("No se encontraron resultados para la búsqueda.");
    }
  }

  return (
    <>
      <div className={style.searchBar}>
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Busca una tienda o producto"
            value={searchString}
            onChange={handleChange}
          />
          <button type="submit">
            <img
              width="35"
              height="35"
              src="https://img.icons8.com/sf-regular/48/FFFFFF/search.png"
              alt="search"
            />
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchBar;
