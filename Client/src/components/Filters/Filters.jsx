import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { selectCategory, getStoresByCategory,resetFilters, selectAlphabetOrder, selectPrice, getAllPosts } from "../../redux/actions";

import style from './Filters.module.css'

const Filters = () => {
  const dispatch = useDispatch();
  const selectedPrice = useSelector((state) => state.selectedPrice);
  const selectedAlphabetOrder = useSelector((state) => state.selectedAlphabetOrder);
  const selectedCategory = useSelector((state) => state.selectedCategory);
  const allStores = useSelector((state) => state.allStoresCopy);
  const allPosts = useSelector((state) => state.allPostsCopy);

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
  };

  const uniqueCategories = () => {
    const filteredPosts = allStores;
    const categories = [...new Set(filteredPosts.map((post) => post.categoria))];
    categories.unshift('Mostrar todas');
    return categories;
  };


  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(getAllPosts());
  };

  return (
    <div className={style.filters}>
        <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="" disabled>
          Categoría
        </option>
        {uniqueCategories().map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
        <select value={selectedPrice} onChange={handlePriceChange}>
        <option value="">Precio</option>
        <option value="asc">Menor a Mayor Precio</option>
        <option value="desc">Mayor a Menor Precio</option>
      </select>
      <select value={selectedAlphabetOrder} onChange={handleAlphabetChange}>
        <option value="">Nombre</option>
        <option value="asc">A-Z</option>
        <option value="desc">Z-A</option>
      </select>
    </div>
  )
}

export default Filters