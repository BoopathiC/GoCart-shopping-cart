import React, { useEffect, useState } from 'react';
import {  AppBar, Toolbar, InputBase,IconButton,Typography,Box,Button, Container, Snackbar, Alert, Modal, Grid, TextField,} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { Search as SearchIcon, AccountCircle, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {setSearchQuery,filterProducts, setSelectedCategory,} from './Feature/ProductSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import './app.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, selectedCategory } = useSelector((state) => state.products);
  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [cartCount, setCartCount] = useState(0); 
  const [cartItems, setCartItems] = useState([]);
  const [openCartModal, setOpenCartModal] = useState(false); 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false, 
    dots: true, 
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1, 
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, 
        },
      },
    ],
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
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
    { name: 'All' },
    { name: "Men's Clothing" },
    { name: "Women's Clothing" },
    { name: 'Electronics' },
  ];

  const handleCategoryClick = (event, category) => {
    setAnchorEl(event.currentTarget);

    if (category.name === 'All') {
      dispatch(setSelectedCategory(''));
    } else {
      dispatch(setSelectedCategory(category.name));
    }

    dispatch(filterProducts());
  };

  const displayedProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category.toLowerCase() === selectedCategory.toLowerCase() : true;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });



  const handleCloseAccountMenu = () => {
    setAccountMenuAnchorEl(null);
  };

  const handleIncreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setCartCount((prevCount) => prevCount + 1);
  };

  const handleDecreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    setCartCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  };

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    setCartCount((prevCount) => prevCount + 1);
    setShowSnackbar(true);
  };

  const handleRemoveItemFromCart = (productId) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === productId);
      if (itemToRemove) {
        setCartCount((prevCount) => prevCount - itemToRemove.quantity);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleCartIconClick = () => {
    setOpenCartModal(true);
  };

  const handleCloseCartModal = () => {
    setOpenCartModal(false);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };


  const handleAccountMenuClick = (event) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null); 
  };

  const handleMenuItemClick = (option) => {
    console.log(option);
    handleMenuClose();
  };
  return (
<div 
  className="App" 
  style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh', 
    background: 'linear-gradient(to top, #f7f7f7,rgb(211, 228, 247))' 
  }}
>
    {/* Navbar */}
    <AppBar position="fixed" sx={{ backgroundColor: '#fff' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'black' }}>
        {/* Left Section: Logo */}

<Box sx={{display: 'flex',alignItems: 'center',cursor: 'pointer', 
      '&:hover': {
      '& .cart-icon': {
        transform: 'rotate(20deg)', transition: 'transform 0.3s ease-in-out', 
      },
      '& .logo-text': {
        color: 'black', transition: 'color 0.3s ease-in-out', 
      },
    },
  }}
>
  <ShoppingCartIcon className="cart-icon" sx={{color: '#c43bf6', fontSize: { xs: '1.5rem', md: '2.5rem' }, marginRight: '8px',}} />
  <Typography className="logo-text" variant="h6" noWrap component="div"
    sx={{
      fontFamily: 'cursive',
      color: '#c43bf6',
      fontSize: { xs: '1rem', md: '2rem' }, 
      marginLeft: { xs: '-8px', md: '4px' }, 
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      transition: 'color 0.3s ease-in-out', 
    }}>
    <span style={{ color: 'black', fontSize: 'inherit' ,fontFamily:'cursive'}}>GO</span>CART
  </Typography>
</Box>


  
        {/* Middle Section: Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            marginLeft: { xs: '0', md: '16px' }, 
            marginRight: { xs: '19px', md: '16px' },
            width: '100%',
            maxWidth: { xs: '140px', md: '500px' }, 
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '5px',
              overflow: 'hidden',
              width: '100%',
              backgroundColor: '#f9f9f9', 
            }} >
            <InputBase
              placeholder="Search…"  value={searchQuery} onChange={handleSearchChange}
              sx={{
                padding: { xs: '4px 6px', md: '6px 8px' },
                borderRadius: '5px',
                background: '#E6E6FA', 
                flexGrow: 1,
                fontSize: { xs: '12px', md: '16px' },
                color: '#333',
                '&::placeholder': {
                  backgroundColor: '#cce7ff', 
                },
              }}  inputProps={{ 'aria-label': 'search' }} />
            <IconButton
              sx={{
                backgroundColor: '#c43bf6', 
                color: 'white',
                padding: { xs: '4px', md: '6px' },
                '&:hover': { backgroundColor: '#d561ff' }, 
              }} >
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
  
        {/* Right Section: Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="large" color="inherit" onClick={handleCartIconClick}
            sx={{
              fontSize: { xs: '20px', md: '24px' },
              marginLeft: { xs: '-28px', md: '16px' }, 
              position: 'relative', 
              '&:hover': { color: '#c43bf6' }, 
            }}
          >
            <ShoppingCartIcon />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '10px',
                  color: 'white',
                }}
              >
                {cartCount}
              </span>
            )}
          </IconButton>
          <IconButton size="large" onClick={handleAccountMenuClick} color="inherit"
            sx={{
              fontSize: { xs: '20px', md: '24px' },
              marginLeft: { xs: '-20px', md: '16px' }, 
              '&:hover': { color: '#c43bf6' }, 
            }}
          >
            <AccountCircle />
          </IconButton>
          
        </Box>
      </Toolbar>
    </AppBar>
    <Toolbar />
  



      {/* Categories */}

<Container sx={{ marginTop: '16px', maxWidth: '100%', borderRadius: '8px',  padding: '16px' }}>
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
    {categories.map((category, index) => (
      <Button key={index} onClick={(event) => handleCategoryClick(event, category)}
      sx={{
        padding: '8px 12px',
        maxHeight: { xs: '60px' },
        minWidth: '120px',
        color: 'black',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.26),rgba(255, 255, 255, 0.32))', 
        backgroundColor: 'transparent', 
        '&:hover': {
          backgroundImage: 'linear-gradient(rgba(156, 221, 241, 0.26),rgba(159, 211, 226, 0.32))', 
          color: 'black',
          transition: 'background-color 0.3s, color 0.3s', 
        },
        border: '1px solid black', 
      }}
    >
      {category.name}
    </Button>
    ))}
  </Box>
</Container>

{/* 
<Container sx={{
  backgroundColor: '#fff',
  color: 'black', 
  padding: '20px',
  borderRadius: '8px',
}}>
</Container> */}


{/*slideshow*/}
<Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        maxHeight: { xs: '600px', sm: 'none' }, 
      }}
    >
      <Slider {...settings}>
        <div>
          <img src={isMobile ? "slide11.png" : "slide111.webp"} alt="Image 1"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
        <div>
          <img src={isMobile ? "slide22.jpg" : "slide2.webp"} alt="Image 2"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
        <div>
          <img src={isMobile ? "slide33.png" : "slide3.webp"} alt="Image 3"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
        <div>
          <img src={isMobile ? "slide44.jpeg" : "slide4.webp"} alt="Image 4"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
      </Slider>
    </Box>
  


{/* Products */}
<Container sx={{ marginTop: '20px', marginBottom: '20px', flex: 1 }}>
  <h2>Products</h2>
  <Grid container spacing={2}>
    {displayedProducts.slice(0, visibleProducts).map((product) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
        <Box
          sx={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(138, 43, 226, 0.5), rgba(147, 112, 219, 0.6), rgba(186, 85, 211, 0.7))', // Lighter gradient background
            textAlign: 'center',
            position: 'relative',
            height: '93%', 
            minHeight: '380px', 
            justifyContent: 'space-between', 
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }
          }} >
          <img  src={product.image} alt={product.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '200px',
              objectFit: 'contain',
              marginBottom: '16px', 
            }} />
          <Typography variant="h6" sx={{ fontSize: '16px', marginBottom: '8px' }}>
            {product.title} 
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray', fontSize: '14px', marginBottom: '8px' }}>
            {product.category} 
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>
            ${product.price} 
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: '8px', 
              backgroundColor: 'rgba(0, 0, 0, 0.66)', 
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.3)' }, 
              alignSelf: 'center',
              padding: '8px 20px',
              fontSize: '14px',
              textTransform: 'none', 
            }}
            onClick={() => handleAddToCart(product)} >
            Add to Cart
          </Button>
        </Box>
      </Grid>
    ))}
  </Grid>
</Container>



{/* Load More/Load Less Buttons */}
<Container
  sx={{
    textAlign: 'center',
    marginBottom: '20px',
    padding: { xs: '10px', md: '20px' }, 
    borderRadius: '8px', 
  }}>
  {visibleProducts < displayedProducts.length && (
    <Button onClick={handleLoadMore}
      sx={{
        marginRight: '16px',
        padding: '8px 16px',
        backgroundColor: '#882bc2',
        color: 'white',
        '&:hover': {
          backgroundColor: '#4A0072', 
        },
      }}
      variant="contained" >
      Load More
    </Button>
  )}
  {visibleProducts > 10 && (
    <Button onClick={handleLoadLess}
      sx={{
        padding: '8px 16px',
        backgroundColor: '#882bc2', 
        color: 'white',
        '&:hover': {
          backgroundColor: '#4A0072', 
        },
      }}
      variant="contained" >  Load Less
    </Button>
  )}
</Container>



<Modal open={openCartModal} onClose={handleCloseCartModal}
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
  <Box
    sx={{
      background: 'linear-gradient(135deg, #ffffff, #f5f5f5)',
      padding: { xs: '16px', md: '20px' },
      borderRadius: '8px',
      width: { xs: '80%', sm: '80%', md: '60%', lg: '50%' },
      maxHeight: '80%',
      overflowY: 'auto',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    }}
  >
    <Button onClick={handleCloseCartModal}
      sx={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        color: '#333',
        backgroundColor: 'transparent',
        '&:hover': { backgroundColor: 'transparent', color: '#d32f2f' },
      }}
    >
      <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>×</Typography>
    </Button>

    <Typography variant="h6" gutterBottom
      sx={{
        textAlign: 'center',
        color: '#333',
        fontFamily: 'Poppins, sans-serif',
      }}> Cart
    </Typography>

    <Grid container spacing={2}>
      {cartItems.length === 0 ? (
        <Typography sx={{ color: '#555', textAlign: 'center', width: '100%' }}>
          No items in your cart
        </Typography>
      ) : (
        cartItems.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                flexDirection: { xs: 'column', sm: 'row' },
              }}>
              <Box
                sx={{
                  width: { xs: '60px', sm: '80px' },
                  height: { xs: '60px', sm: '80px' },
                  overflow: 'hidden',
                  borderRadius: '8px',
                  marginBottom: { xs: '8px', sm: '0' },
                  marginRight: { sm: '16px' },
                }}>
                <img src={item.image} alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }} />
              </Box>

              <Box sx={{ flexGrow: 1, marginBottom: { xs: '8px', sm: '0' } }}>
                <Typography sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  ${item.price}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="outlined" size="small" onClick={() => handleDecreaseQuantity(item.id)} disabled={item.quantity === 1}
                  sx={{
                    minWidth: '32px',
                    height: '32px',
                    marginRight: '8px',
                  }}>
                  -
                </Button>
                <Typography>{item.quantity}</Typography>
                <Button variant="outlined" size="small" onClick={() => handleIncreaseQuantity(item.id)}
                  sx={{
                    minWidth: '32px',
                    height: '32px',
                    marginLeft: '8px',
                  }} >
                  +
                </Button>
              </Box>

              <Button onClick={() => handleRemoveItemFromCart(item.id)} variant="outlined" color="error"
                sx={{
                  marginLeft: '16px',
                  '&:hover': { backgroundColor: '#fce4ec', color: '#d32f2f' },
                }} >
                Remove
              </Button>
            </Box>
          </Grid>
        ))
      )}
    </Grid>

    {cartItems.length > 0 && (
      <>
        <Typography variant="h6"
          sx={{
            marginTop: '16px',
            textAlign: 'right',
            color: '#333',
          }} >
          Total: ${getTotalPrice()}
        </Typography>
        <Button variant="contained"
          sx={{
            marginTop: '16px',
            backgroundColor: '#6A1B9A',
            color: 'white',
            display: 'block',
            marginLeft: 'auto',
            '&:hover': { backgroundColor: '#4A0072' },
          }} >
          Checkout
        </Button>
      </>
    )}
  </Box>
</Modal>



{/* Snackbar */}
<Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
<Alert severity="success" onClose={handleCloseSnackbar}
  sx={{
    width: '100%',
    border: '1px solid black', 
    backgroundColor: '#c43bf6', 
    color: 'white', 
    borderRadius: '8px',
  }}>
  Item added to cart!
</Alert>

</Snackbar>




<footer className="footer">
  <div className="footer-container">
    <div className="footer-section">
      <h3>About Us</h3>
      <hr className="section-divider" />
      <ul>
        <li><a href="#">Our Story</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Privacy Policy</a></li>
      </ul>
    </div>

    <div className="footer-section">
      <h3>Get Help</h3>
      <hr className="section-divider" />
      <ul>
        <li><a href="#">FAQ</a></li>
        <li><a href="#">Shipping & Delivery</a></li>
        <li><a href="#">Returns & Exchanges</a></li>
      </ul>
    </div>

    <div className="footer-section">
      <h3>Contact Us</h3>
      <hr className="section-divider" />
      <ul>
        <li><a href="mailto:cboopathipnr@gmail.com">Email: gocart@gmail.com</a></li>
        <li><a href="tel:+919025550735">Helpline: +91 9876543210</a></li>
      </ul>
    </div>

    <div className="footer-section">
          <h3>Follow Us</h3>
          <hr className="section-divider" />
          <div className="social-icons">
            <IconButton href="#" target="_blank" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton href="#" target="_blank" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton href="#" target="_blank" aria-label="Instagram">
              <Instagram />
            </IconButton>
            <IconButton href="#" target="_blank" aria-label="LinkedIn">
              <LinkedIn />
            </IconButton>
          </div>
        </div>

  </div>

  <div className="footer-bottom">
    <p>&copy; 2024 <strong>GOCART</strong>. All Rights Reserved. | Designed with ❤️</p>
  </div>
</footer>

    </div>
  );
}

export default App;
