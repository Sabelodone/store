import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Box, Typography, Button, Paper, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Check, Package, Truck, ShoppingBag } from 'react-feather';

const OrderConfirmationPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 4, textAlign: 'center' }}>
      {showConfetti && <Confetti />}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'inline-flex', backgroundColor: 'success.main', borderRadius: '50%', p: 2, mb: 4 }}>
            <Check size={48} color="white" />
          </Box>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Typography variant="h3" component="h1" gutterBottom>
            Thank You for Your Order!
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Typography variant="h6" gutterBottom>
            Your order has been successfully placed and is being processed.
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Typography variant="body1" gutterBottom>
            Order number: #12345
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Paper elevation={3} sx={{ p: 3, my: 4, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Order Status
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', my: 2 }}>
              {[
                { icon: <Package />, text: 'Order Received' },
                { icon: <Truck />, text: 'Processing' },
                { icon: <ShoppingBag />, text: 'Shipping' },
              ].map((step, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 2 : 0 }}>
                  {React.cloneElement(step.icon, { size: 24, color: theme.palette.primary.main })}
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {step.text}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Estimated delivery: 3-5 business days
            </Typography>
          </Paper>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingBag />}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default OrderConfirmationPage;