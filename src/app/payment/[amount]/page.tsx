"use client"

import { useState, useEffect } from 'react';
import CheckoutPage from "@/components/Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function Page({ params }: { params: { amount: string } }) {
  const [clientAmount, setClientAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedAmount = parseFloat(params.amount);
    if (!isNaN(parsedAmount)) {
      setClientAmount(parsedAmount);
    } else {
      setError("Invalid amount provided");
    }
  }, [params.amount]);

  function convertToSubcurrency(amount: number, factor = 100) {
    return Math.round(amount * factor);
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (clientAmount === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col items-center justify-center w-screen h-[calc(100vh-80px)]'>

    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(clientAmount),
        currency: "usd",
      }}
    >
      <CheckoutPage amount={clientAmount} />
    </Elements>
        </div>
  );
}
