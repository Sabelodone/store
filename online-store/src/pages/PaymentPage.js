import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';
import CheckoutPage from './CheckoutPage';  // Import CheckoutPage

const PaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        validationErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Payment submitted:', formData);
      navigate('/order-confirmation');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Payment Details
      </Typography>

      {/* Render CheckoutPage */}
      <CheckoutPage />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit Payment'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PaymentPage;
