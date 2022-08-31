import React from "react";

export default function CheckoutWizard({ active = 0 }) {
  return (
    <div className="hidden md:flex max-w-3xl m-auto mt-32 text-center">
      {["Login Menu", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <div
            key={step}
            className={`w-full items-center ${index <= active ? "text-emerald-300" : "text-stone-300"}`}
          >
            <span className={`py-1 px-3 mb-3 inline-block rounded-full ${index <= active && "bg-emerald-700"}`}>
              {index + 1}
            </span>
            <div>{step}</div>
          </div>
        )
      )}
    </div>
  );
}
