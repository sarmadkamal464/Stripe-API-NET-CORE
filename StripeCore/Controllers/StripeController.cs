using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StripeCore.Contracts;
using StripeCore.Models.Stripe;
using System.Diagnostics;
using Stripe;

namespace StripeCore.Controllers
{
    public class StripeController : Controller
    {
        private readonly IStripeAppService _stripeService;

        public StripeController(IStripeAppService stripeService)
        {
            _stripeService = stripeService;
        }
        public IActionResult Index()
        {
            return View("Views/Stripe/checkout.cshtml");
        }

        public IActionResult Thanks()
        {
            return View("Views/Stripe/thanks.cshtml");
        }

        public IActionResult Form()
        {
            var paymentIntentService = new PaymentIntentService();
            var paymentIntent = paymentIntentService.Create(new PaymentIntentCreateOptions
            {
                Amount = 25000,
                Currency = "usd",
                ReceiptEmail = "Sarmadkamal4646@test.com",
                Metadata = new Dictionary<string, string>
                {
                    { "Name", "Sarmad Kamal" },
                },
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = false,
                },
            });
            return Json(new { paymentIntent });
        }

    [HttpPost("customer/add")]
        public async Task<ActionResult<StripeCustomer>> AddStripeCustomer(
            [FromBody] AddStripeCustomer customer,
            CancellationToken ct)
        {
            Console.WriteLine("Im here");
            StripeCustomer createdCustomer = await _stripeService.AddStripeCustomerAsync(
                customer,
                ct);

            return StatusCode(StatusCodes.Status200OK, createdCustomer);
        }

        [HttpPost("payment/add")]
        public async Task<ActionResult<StripePayment>> AddStripePayment(
            [FromBody] AddStripePayment payment,
            CancellationToken ct)
        {
            StripePayment createdPayment = await _stripeService.AddStripePaymentAsync(
                payment,
                ct);

            return StatusCode(StatusCodes.Status200OK, createdPayment);
        }
    }
}