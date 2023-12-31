import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCategory,
  getStoresByCategory,
  resetFilters,
  selectAlphabetOrder,
  selectPrice,
  getAllPosts,
  getAllStores,
  getStores2ByCategory,
} from "../../redux/actions";

import style from "./Filters.module.css";

const Filters = () => {
  const dispatch = useDispatch();
  const selectedPrice = useSelector((state) => state.selectedPrice);
  const selectedAlphabetOrder = useSelector(
    (state) => state.selectedAlphabetOrder
  );
  const selectedCategory = useSelector((state) => state.selectedCategory);
  const allStores = useSelector((state) => state.allStoresCopy);
  const [botonFiltros, setBotonFiltros] = useState(false);

  const handlePriceChange = (event) => {
    const price = event.target.value;
    dispatch(selectPrice(price));
  };

  const handleAlphabetChange = (event) => {
    const alphabetOrder = event.target.value;
    dispatch(selectAlphabetOrder(alphabetOrder));
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    dispatch(selectCategory(category));
    dispatch(getStoresByCategory(category));
    dispatch(getStores2ByCategory(category));
  };

  const uniqueCategories = () => {
    const filteredPosts = allStores;
    const categories = [
      ...new Set(filteredPosts.map((post) => post.categoria)),
    ];
    categories.unshift("🔍 Mostrar todas");
    return categories;
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(getAllPosts());
    dispatch(getAllStores());
  };

  const toggleFilters = () => {
    setBotonFiltros(!botonFiltros);
  };

  return (
    <>
      <div className={style.filters}>
        <button onClick={toggleFilters}>Filtrar</button>
        {botonFiltros && (
          <div className={style.filtros}>
            <h3>Filtros</h3>
            {!location.hash.includes("/mitienda/") &&
              !location.hash.includes("/tienda/") && 
              !location.hash.includes("/misventas") && (
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="" disabled>
                    Categoría
                  </option>
                  {uniqueCategories().map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            <select value={selectedPrice} onChange={handlePriceChange}>
              <option value="" disabled>
                Precio
              </option>
              <option value="asc">Menor a Mayor Precio</option>
              <option value="desc">Mayor a Menor Precio</option>
            </select>
            <select
              value={selectedAlphabetOrder}
              onChange={handleAlphabetChange}
            >
              <option value="" disabled>
                Nombre
              </option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
            <button onClick={toggleFilters}>Hecho</button>
            <button onClick={handleResetFilters} className={style.limpiar}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Filters;
