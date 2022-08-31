import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/store";

export default function Payment() {
  const [selected, setSelected] = useState("");
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;
  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    if (!selected) {
      return toast.warning("payment for this field required");
    }
    dispatch({ type: 'SAVE_PAYMENT', payload: selected });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selected,
      })
    );

    router.push('/placeOrder')
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelected(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);
  return (
    <Layout title="Payment Method">
      <CheckoutWizard active={2} />
      <div className="m-auto mt-28 bg-footer-background p-16 rounded-lg w-11/12 md:max-w-4xl md:mt-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Payment Method
        </h2>
        <form onSubmit={submitHandler}>
          {["Paypal", "Stripe", "Cash On Delivery"].map((payment, index) => (
            <div key={index} className="text-lg font-semibold text-white">
              <input
                type="radio"
                id={payment}
                autoFocus
                className="m-3 outline-none focus:ring-0"
                checked={selected === payment}
                onChange={() => setSelected(payment)}
              />
              <label htmlFor={payment}>{payment}</label>
            </div>
          ))}
          <div className="flex flex-col justify-between mb-6 mt-12 h-24 ">
            <button className="p-2 rounded-md bg-amber-300 hover:bg-amber-400 font-semibold ">
              Next
            </button>
            <button
              onClick={() => router.push("/shipping")}
              type="button"
              className="p-2 rounded-md bg-gray-300 hover:bg-gray-400 font-semibold "
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

Payment.auth = true