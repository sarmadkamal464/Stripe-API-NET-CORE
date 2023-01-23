# ASP.NET CORE MVC Stripe Application

### APP URL: https://localhost:7069/
### Swagger URL: https://localhost:7069/swagger/index.html

### Swagger Test Payload:

### Test Payload for customer/add 
    {
    "email": "yoourmail@gmail.com",
    "name": "Sarmad Kamal",
    "creditCard": {
        "name": "Sarmad Kamal",
        "cardNumber": "4242424242424242",
        "expirationYear": "2024",
        "expirationMonth": "12",
        "cvc": "999"
        }
    }
### Test Payload for payment/add
    {
    "customerId": "${customer_id}",
    "receiptEmail": "yoourmail@test.com",
    "description": "Demo product for Stripe .NET API",
    "currency": "USD",
    "amount": 1000
    }
#### customer_id value come from customer/add API