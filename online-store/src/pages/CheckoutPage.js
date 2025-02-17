import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/currencyFormat';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CreditCard, Truck, CheckCircle } from 'react-feather';
import cardValidator from 'card-validator';
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcDinersClub,
  FaCcJcb,
} from 'react-icons/fa';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'relative',
}));

const steps = [
  { label: 'Shipping Information', icon: <Truck color="#1e88e5" /> },
  { label: 'Payment Details', icon: <CreditCard color="#43a047" /> },
  { label: 'Review Order', icon: <CheckCircle color="#ffb300" /> },
];

const cardLogos = {
  visa: <FaCcVisa />,
  mastercard: <FaCcMastercard />,
  'american-express': <FaCcAmex />,
  discover: <FaCcDiscover />,
  'diners-club': <FaCcDinersClub />,
  jcb: <FaCcJcb />,
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [cardType, setCardType] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      enqueueSnackbar('Your cart is empty. Please add items before proceeding with checkout.', { variant: 'warning' });
      navigate('/products');
    }
  }, [cart, navigate, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error when the user starts typing

    if (name === 'cardNumber') {
      const cardInfo = cardValidator.number(value);
      if (cardInfo.card) {
        setCardType(cardInfo.card.type);
      } else {
        setCardType('');
      }
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (activeStep === 1) {
      if (!formData.cardNumber) validationErrors.cardNumber = 'Card Number is required';
      if (!formData.cardName) validationErrors.cardName = 'Name on Card is required';
      if (!formData.cardCVC) validationErrors.cardCVC = 'CVC is required';
    }

    if (activeStep === 0) {
      if (!formData.firstName) validationErrors.firstName = 'First Name is required';
      if (!formData.lastName) validationErrors.lastName = 'Last Name is required';
      if (!formData.email) validationErrors.email = 'Email is required';
      if (!formData.address) validationErrors.address = 'Address is required';
      if (!formData.city) validationErrors.city = 'City is required';
      if (!formData.country) validationErrors.country = 'Country is required';
      if (!formData.zipCode) validationErrors.zipCode = 'Zip Code is required';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Order submitted:', { ...formData, items: cart });
      clearCart();
      enqueueSnackbar('Order placed successfully!', { variant: 'success' });
      navigate('/order-confirmation');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  required
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                />
                {cardType && (
                  <Box sx={{ ml: 2 }}>
                    {cardLogos[cardType]}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Name on Card"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                error={!!errors.cardName}
                helperText={errors.cardName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Expiry Date"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={handleChange}
                error={!!errors.cardExpiry}
                helperText={errors.cardExpiry}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="CVC"
                name="cardCVC"
                value={formData.cardCVC}
                onChange={handleChange}
                error={!!errors.cardCVC}
                helperText={errors.cardCVC}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              {cart.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography>{formatCurrency(item.price * item.quantity)}</Typography>
                </Box>
              ))}
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{formatCurrency(total)}</Typography>
              </Box>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
        {steps.map(({ label, icon }) => (
          <Step key={label}>
            <StepLabel icon={icon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <StyledPaper>
            <form onSubmit={handleSubmit}>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                )}
                <StyledButton
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                  {isSubmitting && (
                    <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%' }} />
                  )}
                </StyledButton>
              </Box>
            </form>
          </StyledPaper>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default CheckoutPage;