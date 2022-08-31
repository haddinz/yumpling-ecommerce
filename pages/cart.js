import React, { useContext } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Store } from "../utils/store";

function Cart() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  function deleteHandler(item) {
    dispatch({ type: "CART_DELETE_ITEM", payload: item });
  }

  const increaseItem = (item) => {
    const existItem = state.cart.cartItems.find((x) => x.slug === item.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    if (existItem.countInStock < quantity) {
      window.alert("Product Not Enought");
      const quantity = existItem ? existItem.quantity + 0 : 1;
      dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
      return;
    }
  };

  const decreaseItem = (item) => {
    const existItem = state.cart.cartItems.find((x) => x.slug === item.slug);
    const quantity = existItem ? existItem.quantity - 1 : 1;
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    if (quantity === 0) {
      dispatch({ type: "CART_DELETE_ITEM", payload: item });
    }
  };

  return (
    <Layout title="shopping cart">
      <div className="container md:w-4/5 m-auto mt-28 w-11/12">
        {cartItems == 0 ? (
          <div>
            <p className="text-lg font-semibold">Your cart is empty</p>
            <Link href="/product/menu">
              <a className="text-link font-semibold my-5 hover:text-amber-300 cursor-pointer">
                Back to menu
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 md:gap-1">
            <div className="md:col-span-3 col-span-2 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="p-5 text-center border-4 bg-footer-background text-white">
                      Item
                    </th>
                    <th className="p-5 text-center border-4 bg-footer-background text-white">
                      Quantity
                    </th>
                    <th className="p-5 text-center border-4 bg-footer-background text-white">
                      Price
                    </th>
                    <th className="p-5 text-center border-4 bg-footer-background text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                {cartItems.map((item) => (
                  <tbody key={item.slug}>
                    <tr>
                      <td className="p-5 text-center border-4 font-semibold ">
                        <Link href={`/product/menu/${item.slug}`}>
                          <a>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                            ></Image>
                          </a>
                        </Link>
                        <p>{item.name}</p>
                      </td>
                      <td className="p-5 text-center border-4 font-semibold">
                        <div className="flex justify-center items-center">
                          <button
                            className="py-1 px-2 mr-2 bg-footer-background rounded-lg text-white font-semibold"
                            onClick={() => increaseItem(item)}
                          >
                            +
                          </button>
                          <div>{item.quantity}</div>
                          <button
                            className="py-1 px-2 ml-2 bg-footer-background rounded-lg text-white font-semibold"
                            onClick={() => decreaseItem(item)}
                          >
                            -
                          </button>
                        </div>
                      </td>
                      <td className="p-5 text-center border-4 font-semibold">
                        ${item.price}
                      </td>
                      <td className="text-center border-4 font-bold">
                        <button
                          className="bg-footer-background px-5 py-3 rounded-full text-white"
                          onClick={() => deleteHandler(item)}
                        >
                          x
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
            <div className="ml-5 col-span-2 md:col-span-1">
              <div className="flex justify-between my-1 text-lg font-semibold">
                <h2>Item Total :</h2>
                <div>{cartItems.reduce((a, b) => a + b.quantity, 0)}</div>
              </div>
              <div className="flex justify-between my-1 text-lg font-semibold">
                <h2>Sub Total :</h2>
                <div>
                  ${cartItems.reduce((a, b) => a + b.quantity * b.price, 0)}
                </div>
              </div>
              <button
                onClick={() => router.push("login?redirect=/shipping")}
                className="font-semibold w-full bg-amber-300 hover:bg-amber-400 p-2 rounded text-white mt-5"
              >
                Check Out
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
