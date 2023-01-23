using System;
namespace StripeCore.Models.Stripe
{
    public record AddStripeCustomer(
		string Email,
		string Name,
		AddStripeCard CreditCard);
}