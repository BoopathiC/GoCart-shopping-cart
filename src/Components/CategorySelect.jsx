import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectAllCategories } from '../Feature/CategorySlice';

const CategorySelect = ({ setSelectedCategory }) => {
    const dispatch = useDispatch();
    const categories = useSelector(selectAllCategories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
            ))}
        </select>
    );
};

export default CategorySelect;
