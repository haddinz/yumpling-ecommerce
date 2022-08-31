import React, { useContext } from "react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import CheckoutWizard from "../components/CheckoutWizard";
import { Store } from "../utils/store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Shipping() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = ({ name, country, postalCode, address, city }) => {
    dispatch({
      type: "SHIPPING_ADDRESS",
      payload: { name, country, postalCode, address, city },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          name,
          country,
          postalCode,
          address,
          city,
        },
      })
    );
    router.push("/payment");
  };

  return (
    <Layout title="shipping">
      <CheckoutWizard active={1} />
      <div className="m-auto mt-28 bg-footer-background p-16 rounded-lg w-11/12 md:max-w-4xl md:mt-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Shipping Address
        </h2>
        <form
          className="text-white border-none"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="flex flex-col mb-6 border-solid border-gray-600">
            <label className="pb-2" htmlFor="name">
              Name
            </label>
            <input
              type="name"
              id="name"
              autoFocus
              className="p-2 rounded-md bg-stone-700"
              {...register("name", {
                required: "please enter your name",
              })}
            ></input>
            {errors.name && (
              <div className="text-white">{errors.name.message}</div>
            )}
          </div>
          <div className="flex flex-col mb-6 border-solid border-gray-600">
            <label className="pb-2" htmlFor="address">
              Address
            </label>
            <input
              type="address"
              id="address"
              autoFocus
              className="p-2 rounded-md bg-stone-700"
              {...register("address", {
                required: "please enter your address",
              })}
            ></input>
            {errors.address && (
              <div className="text-white">{errors.address.message}</div>
            )}
          </div>
          <div className="flex flex-col mb-6 border-solid border-gray-600">
            <label className="pb-2" htmlFor="city">
              City
            </label>
            <input
              type="city"
              id="city"
              autoFocus
              className="p-2 rounded-md bg-stone-700"
              {...register("city", {
                required: "please enter your city",
              })}
            ></input>
            {errors.city && (
              <div className="text-white">{errors.city.message}</div>
            )}
          </div>
          <div className="flex flex-col mb-6 border-solid border-gray-600">
            <label className="pb-2" htmlFor="postalCode">
              Postal Code
            </label>
            <input
              type="postalCode"
              id="postalCode"
              autoFocus
              className="p-2 rounded-md bg-stone-700"
              {...register("postalCode", {
                required: "please enter your postal code",
              })}
            ></input>
            {errors.postalCode && (
              <div className="text-white">{errors.postalCode.message}</div>
            )}
          </div>
          <div className="flex flex-col mb-6 border-solid border-gray-600">
            <label className="pb-2" htmlFor="country">
              Country
            </label>
            <input
              type="country"
              id="country"
              autoFocus
              className="p-2 rounded-md bg-stone-700"
              {...register("country", {
                required: "please enter your country",
              })}
            ></input>
            {errors.country && (
              <div className="text-white">{errors.country.message}</div>
            )}
          </div>
          <div className="flex flex-col mb-6 mt-12">
            <button className="p-2 rounded-md bg-amber-300 hover:bg-amber-400 font-semibold ">
              Next
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

Shipping.auth = true;
