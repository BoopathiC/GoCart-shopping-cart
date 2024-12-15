import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from './pathToYourSlice';

const SearchBar = () => {
  const dispatch = useDispatch();

  const handleSearch = () => {
    const query = document.querySelector('.search-bar input').value;
    dispatch(fetchProducts({ category: query, page: 0 }));
  };

  return (
    <div className="search-bar">
      <input type="text" placeholder="Search products..." />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
