import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Typography,
  Box,
  Button,
  Container,
} from '@mui/material';
import { Grid } from '@mui/material';
import { Search as SearchIcon, AccountCircle, ShoppingCart } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setSearchQuery,
  filterProducts,
  setSelectedCategory,
} from './Feature/ProductSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import './app.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, selectedCategory } = useSelector((state) => state.products);

  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (searchQuery && params.get('search') !== searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    navigate({ search: params.toString() });
  }, [searchQuery, navigate, location.search]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    dispatch(setSearchQuery(query));
    dispatch(filterProducts());
  };

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  const handleLoadLess = () => {
    setVisibleProducts((prev) => Math.max(10, prev - 10));
  };

  const categories = [
    { name: 'All Categories' },
    { name: 'beauty' },
    { name: 'furniture' },
    { name: 'groceries' },
    { name: 'fragrances' },
    { name: 'electronics' },
  ];

  const handleCategoryClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    if (category.name === 'All Categories') {
      dispatch(setSelectedCategory(''));
    } else {
      dispatch(setSelectedCategory(category.name));
    }
    dispatch(filterProducts());
  };

  const handleAccountMenuClick = (event) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAccountMenuAnchorEl(null);
  };

  const displayedProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f8f8' }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
        <Toolbar
          sx={{
            justifyContent: { xs: 'space-between', md: 'center' },
            alignItems: 'center',
            color: 'white',
            gap: { md: '40px' },
          }}
        >
          {/* Logo on the Left */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              color: 'white',
              fontSize: { xs: '1rem', md: '2rem' },
              marginRight: 'auto',
            }}
          >
            <span style={{ color: 'greenYellow', fontSize: { xs: '1.5rem', md: '2rem' } }}>E</span> store
          </Typography>

          {/* Search Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 0 },
              justifyContent: { xs: 'center', md: 'center' },
              margin: { xs: '0 8px', md: 0 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '5px',
                overflow: 'hidden',
                width: { xs: '100%', md: '500px' },
              }}
            >
              <InputBase
                placeholder="Search…"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  padding: '6px 8px',
                  borderRadius: '5px',
                  background: '#fff',
                  flexGrow: 1,
                  fontSize: { xs: '10px', md: '16px' },
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton sx={{ backgroundColor: 'black', color: 'white', padding: '6px' }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Account and Cart Icons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: { xs: 'auto', md: 0 },
            }}
          >
            <IconButton size="large" color="inherit">
              <ShoppingCart />
            </IconButton>
            <IconButton size="large" edge="end" onClick={handleAccountMenuClick} color="inherit" sx={{ marginLeft: '4px' }}>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* This Toolbar is used for spacing below the AppBar */}

      {/* Categories Row Below Navbar */}
      <Container sx={{ marginTop: '16px', color: '#000', maxWidth: '100%', borderRadius: '8px', backgroundColor: '#fff', padding: '16px' }}>
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
    {categories.map((category, index) => (
      <Button
        key={index}
        onClick={(event) => handleCategoryClick(event, category)}
        sx={{
          padding: '8px 12px',
          minWidth: '120px',
          color: 'black',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'greenyellow', // Change background color on hover
            color: 'black', // Change text color on hover
            transition: 'background-color 0.3s, color 0.3s', // Smooth transition
          }
        }}
      >
        {category.name}
      </Button>
    ))}
  </Box>
</Container>


      {/* Main Content */}
      <Container sx={{ marginTop: '20px', marginBottom: '20px', flex: 1 }}>
        <Box mt={2}>
          <h2>Products</h2>
          <Grid container spacing={2}>
  {displayedProducts.length > 0 ? (
    displayedProducts.slice(0, visibleProducts).map((product) => (
      <Grid item xs={12} sm={6} md={2.4} key={product.id}>
  <div
    className="product-item"
    style={{
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      textAlign: 'center',
      boxSizing: 'border-box',
      height: 'auto', // Remove fixed height
      minHeight: '350px', // Minimum height for better visibility on mobile
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <img
      src={product.thumbnail}
      alt={product.title}
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: '250px',
        objectFit: 'contain',
        overflow: 'hidden',
      }}
    />
    <h4 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {product.title}
    </h4>
    <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {product.description}
    </p>
    <p>Price: ${product.price}</p>
  </div>
</Grid>

    ))
  ) : (
    <Grid item xs={12}>
      <Typography variant="h6" color="textSecondary" textAlign="center">
        No results found
      </Typography>
    </Grid>
  )}
</Grid>
            
          {/* Load More / Load Less Buttons */}
          <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
  {visibleProducts < displayedProducts.length && (
    <Button
      variant="contained"
      onClick={handleLoadMore}
      sx={{
        backgroundColor: 'black',
        color: 'white', // Ensure the text is readable
        '&:hover': {
          backgroundColor: 'gray', // Adjusted color for hover effect
        },
      }}
    >
      Load More
    </Button>
  )}
  {visibleProducts > 10 && (
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleLoadLess}
      sx={{
        marginLeft: '8px',
        backgroundColor: 'black',
        color: 'white', // Ensure the text is readable
        '&:hover': {
          backgroundColor: 'gray', // Adjusted color for hover effect
        },
      }}
    >
      Load Less
    </Button>
  )}
</Box>

        </Box>
      </Container>

      {/* Fixed Footer */}
      <footer style={{ backgroundColor: 'black', color: 'white', padding: '16px', textAlign: 'center' }}>
        &copy; {new Date().getFullYear()} Store. Designed/Developed by{' '}
        <span style={{ color: 'greenyellow', fontFamily: 'Poppins, sans-serif' }}>Boopathi</span>.
      </footer>
    </div>
  );
}

export default App;
