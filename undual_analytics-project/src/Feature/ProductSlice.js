// src/redux/productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    categories: [],
    products: [],
    filteredProducts: [],
    selectedCategory: '',
    searchQuery: '',
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload; // Initially display all products
    },
    filterProducts: (state) => {
      const { products, selectedCategory, searchQuery } = state;
      state.filteredProducts = products.filter((product) => {
        const matchesCategory =
          selectedCategory === '' || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

// Thunk for fetching products and categories
export const fetchProductsAndCategories = () => async (dispatch) => {
  try {
    const categoriesResponse = await axios.get('https://dummyjson.com/products/categories');
    dispatch(setCategories(categoriesResponse.data));

    const productsResponse = await axios.get('https://dummyjson.com/products');
    dispatch(setProducts(productsResponse.data.products));

    // If you want to derive categories from products (optional)
    const uniqueCategories = [...new Set(productsResponse.data.products.map(product => product.category))];
    dispatch(setCategories(uniqueCategories));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Export actions and reducer
export const { setCategories, setProducts, filterProducts, setSelectedCategory, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
