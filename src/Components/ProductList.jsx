import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts } from '../Feature/ProductSlice';
import { selectSearchTerm } from '../Feature/SearchSlice';

const ProductList = ({ selectedCategory }) => {
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const searchTerm = useSelector(selectSearchTerm);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedProducts = await dispatch(fetchProducts({ category: selectedCategory, page: currentPage }));
            if (fetchedProducts.payload.length < 10) {
                setHasMore(false); // No more products to fetch
            }
        };
        fetchData();
    }, [dispatch, selectedCategory, currentPage]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const loadMoreProducts = () => {
        if (hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div>
            {filteredProducts.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.price}</p>
                </div>
            ))}
            {hasMore && (
                <button onClick={loadMoreProducts}>Load More</button>
            )}
        </div>
    );
};

export default ProductList;
