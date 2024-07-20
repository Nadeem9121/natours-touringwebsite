import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51PdXO1L8JPXxP6tul3TmXl63hDhSIMpMtX316rdT9K8bdp0Hl5u9jjSyyAiU7epZJDUfJnI1jlkBVTFhpWoxlaUX00QWEuG6pv'
);
export const bookTour = async (tourId) => {
  try {
    //1)get the checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    //2) create checkout form+charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch {
    console.log(err);
    showAlert('error', err);
  }
};
