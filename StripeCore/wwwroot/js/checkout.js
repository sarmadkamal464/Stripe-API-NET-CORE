// This is your test publishable API key.
const stripe = Stripe("pk_test_fA1rHO8k8lDqjm4qaSFyJrlx");

// The items the customer wants to buy
const items = [{ id: "subscription" }];

let elements;

initialize();
checkStatus();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

var emailAddress = '';
// Fetches a payment intent and captures the client secret
async function initialize() {
  setLoading(true);
  const res = await fetch("/stripe/form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  let response = await res.json();
  const clientSecret = response.paymentIntent.clientSecret;
  const receiptEmail = response.paymentIntent.receiptEmail;
  emailAddress = receiptEmail;
  const metadata = response.paymentIntent.metadata.Name;

  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({
    appearance,
    clientSecret,
    receiptEmail,
    metadata
  });

  // Create and mount the Address Element in shipping mode
  const addressElement = elements.create("address", {
    mode: "shipping",
    defaultValues: {
      name: metadata
    }
  });
  addressElement.mount("#address-element");

  addressElement.on('change', (event) => {
    if (event.complete) {
      // Extract potentially complete address
      const address = event.value.address;
    }
  })

  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  linkAuthenticationElement.on('change', (event) => {
    emailAddress = event.value.email;
  });

  const paymentElementOptions = {
    layout: "tabs",
    defaultValues: {
      billingDetails: {
        email: emailAddress
      }
    }
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
  setLoading(false);
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  const {
    error
  } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: `${window.location.origin}/stripe/thanks`,
      receipt_email: emailAddress,
    },
  });

  const handleNextStep = async () => {
    const addressElement = elements.getElement('address');

    const {
      complete,
      value
    } = await addressElement.getValue();

    if (complete) {
      // Allow user to proceed to the next step
      // Optionally, use value to store the address details
    }
  };

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}