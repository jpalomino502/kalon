import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const CheckoutForm = ({ onSuccessfulCheckout }) => {
  const handlePaymentSuccess = (details, data) => {
    console.log('Pago exitoso:', details);
    onSuccessfulCheckout(details); // Llamar a la función de éxito con los detalles del pago
  };

  const handlePaymentError = (err) => {
    console.error('Error en el pago:', err);
  };

  return (
    <PayPalScriptProvider options={{ 'client-id': 'AQPPZMLkmhASUhOkOi55CtNQdQUjKwq4vJpotDxgyK43XL_gV2hsNktLUZty4CFTV2oY1jfuup_F5M8q' }}>
      <div>
        <h2>Procesar Pago con PayPal</h2>
        <PayPalButtons
          style={{ layout: 'horizontal' }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: '10.00', // Monto a cobrar
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(function (details) {
              handlePaymentSuccess(details, data);
            });
          }}
          onError={(err) => handlePaymentError(err)}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default CheckoutForm;
