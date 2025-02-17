import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/currencyFormat';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import Confetti from 'react-confetti';
import { useSnackbar } from 'notistack';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Zoom,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-4px)',
  },
}));

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [savedForLater, setSavedForLater] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const animatedTotal = useSpring({
    number: total,
    from: { number: 0 },
  });

  useEffect(() => {
    const savedItems = localStorage.getItem('savedForLater');
    if (savedItems) {
      setSavedForLater(JSON.parse(savedItems));
    }
  }, []);

  const saveForLater = (item) => {
    removeFromCart(item.id);
    setSavedForLater((prev) => {
      const newSavedItems = [...prev, item];
      localStorage.setItem('savedForLater', JSON.stringify(newSavedItems));
      return newSavedItems;
    });
    enqueueSnackbar(`${item.name} saved for later`, { variant: 'success' });
  };

  const moveToCart = (item) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));
    updateQuantity(item.id, 1);
    enqueueSnackbar(`${item.name} moved to cart`, { variant: 'success' });
  };

  const handleCheckout = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate('/checkout');
    }, 3000);
  };

  const cartItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4 }}>
      {showConfetti && <Confetti />}
      <Typography variant="h3" component="h1" gutterBottom>
        Your Cart
      </Typography>
      {cart.length === 0 && savedForLater.length === 0 ? (
        <Fade in={true}>
          <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', marginBottom: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cartItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <StyledCard>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: 8 }} />
                        </Grid>
                        <Grid item xs={5}>
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatCurrency(item.price)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Box display="flex" alignItems="center">
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity === 1}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              inputProps={{ min: 1, style: { textAlign: 'center' } }}
                              sx={{ width: 40, mx: 1 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" align="right">
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                          <Box display="flex" justifyContent="flex-end">
                            <Tooltip title="Remove from cart" arrow>
                              <IconButton
                                size="small"
                                onClick={() => removeFromCart(item.id)}
                                color="error"
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Save for later" arrow>
                              <IconButton
                                size="small"
                                onClick={() => saveForLater(item)}
                                color="primary"
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              ))}
            </AnimatePresence>
            {savedForLater.length > 0 && (
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Saved for Later
                </Typography>
                <AnimatePresence>
                  {savedForLater.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={cartItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <StyledCard>
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={3}>
                              <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: 8 }} />
                            </Grid>
                            <Grid item xs={7}>
                              <Typography variant="h6">{item.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatCurrency(item.price)}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Box display="flex" justifyContent="flex-end">
                                <Tooltip title="Move to cart" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => moveToCart(item)}
                                    color="primary"
                                  >
                                    <RestoreIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Zoom in={true}>
              <Paper elevation={3} sx={{ padding: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h5" gutterBottom>
                  Order Summary
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="subtitle1">
                      {formatCurrency(total)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Shipping" />
                    <Typography variant="subtitle1" color="success.main">
                      Free
                    </Typography>
                  </ListItem>
                </List>
                <Divider />
                <ListItem>
                  <ListItemText primary="Total" />
                  <Typography variant="h6">
                    <animated.span>
                      {animatedTotal.number.to((val) => formatCurrency(val))}
                    </animated.span>
                  </Typography>
                </ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<LocalShippingIcon />}
                  sx={{ mt: 2 }}
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </Button>
                {!isMobile && (
                  <Box mt={2} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Need help? Call 1-800-123-4567
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      )}
      {cart.length > 0 && (
        <Box mt={4} ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => {
                clearCart();
                enqueueSnackbar('Cart cleared', { variant: 'info' });
              }}
              sx={{ mr: 2 }}
            >
              Clear Cart
            </Button>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              startIcon={<ShoppingCartIcon />}
            >
              Continue Shopping
            </Button>
          </motion.div>
        </Box>
      )}
    </Box>
  );
};

export default CartPage;

