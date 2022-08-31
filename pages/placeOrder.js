import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/store";

function PlaceOrder() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const roundNumbers = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemPrice = roundNumbers(
    cartItems.reduce((a, b) => a + b.quantity * b.price, 0)
  );
  // const itemPrice = cartItems.reduce((a, b) => a + b.quantity * b.price, 0)
  const taxPrice = roundNumbers(itemPrice * 0.15);
  const shippingPrice = itemPrice > 200 ? 0 : 15;
  const totalPrice = itemPrice + taxPrice + shippingPrice;
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);
  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "CLEAR_SAVE_ITEMS" });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(true);
      toast.error("Error on Place Order");
      setLoading(false);
    }
  };
  return (
    <Layout>
      <CheckoutWizard active={3} />
      <div className="containerBox">
        <h2 className="text-3xl font-bold text-center text-white">
          Place Order
        </h2>
      </div>
      <div className="grid grid-cols-1 m-auto w-11/12 gap-5 mb-10 lg:grid-cols-3 lg:max-w-6xl ">
        <div className="col-span-2">
          <div className="rounded-lg shadow-md p-5">
            <p className="font-semibold text-lg">Shipping Address</p>
            <div>
              {shippingAddress.name}, {shippingAddress.address},{" "}
              {shippingAddress.city}, {shippingAddress.postalCode},{" "}
              {shippingAddress.country}
            </div>
            <Link href="/shipping">
              <a className="text-link font-semibold my-5 hover:text-amber-300 cursor-pointer">
                edit
              </a>
            </Link>
          </div>

          <div className="rounded-lg shadow-md p-5">
            <p className="font-semibold text-lg">Payment Method</p>
            <div>{paymentMethod}</div>
            <Link href="/payment">
              <a className="text-link font-semibold my-5 hover:text-amber-300 cursor-pointer">
                edit
              </a>
            </Link>
          </div>

          <div className="rounded-lg shadow-md p-5">
            <p className="font-semibold text-lg mb-5">Order Items</p>
            <table className="min-w-full mb-5">
              <thead className="border-b py-5">
                <tr className="py-3">
                  <th className="text-left p-5">Item</th>
                  <th className="text-center p-5">Price</th>
                  <th className="text-center p-5">Quantity</th>
                  <th className="text-center p-5">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td className="flex items-center py-5">
                      <Link
                        href={`/product/menu/${item.slug}`}
                        className="cursor-pointer"
                      >
                        <a>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                          ></Image>
                        </a>
                      </Link>
                      <p className="ml-5">{item.name}</p>
                    </td>
                    <td className="text-center p-5">${item.price}</td>
                    <td className="text-center p-5">{item.quantity}</td>
                    <td className="text-center p-5">
                      {item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/cart">
              <a className="text-link font-semibold my-5 hover:text-amber-300 cursor-pointer">
                edit
              </a>
            </Link>
          </div>
        </div>

        <div>
          <div className="rounded-lg shadow-md p-5">
            <p className="font-semibold text-lg">Summary</p>
            <ul>
              <li>
                <div className="flex justify-between py-3">
                  <p>Items Price</p>
                  <p>$ {itemPrice}</p>
                </div>
              </li>
              <li>
                <div className="flex justify-between py-3">
                  <p>Tax Price</p>
                  <p>$ {taxPrice}</p>
                </div>
              </li>
              <li>
                <div className="flex justify-between pt-3 pb-7 mb-5 border-b">
                  <p>Shipping Price</p>
                  <p>$ {shippingPrice}</p>
                </div>
              </li>
              <li>
                <div className="flex justify-between py-3">
                  <p>Total Price</p>
                  <p>$ {totalPrice}</p>
                </div>
              </li>
            </ul>
          </div>
          <button
            disabled={loading}
            onClick={placeOrderHandler}
            className="shadow-md font-semibold w-full bg-amber-300 hover:bg-amber-400 p-2 rounded-lg text-white mt-5"
          >
            {loading ? "Loading...." : "Order"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

PlaceOrder.auth = true;
export default PlaceOrder
