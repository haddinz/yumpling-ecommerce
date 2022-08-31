/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import Link from "next/link";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
// import data from "../../utils/data";
import db from "../../utils/db";
import { Store } from "../../utils/store";

export default function Menu({products}) {
  const { state, dispatch } = useContext(Store);
  const product = products;
  const addToCartHandler = (product) => {
    if (product.countInStock > 0) {
      const existItem = state.cart.cartItems.find(
        (e) => e.name === product.name
      );
      const quantity = existItem ? existItem.quantity + 1 : 1;
      dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
      if (product.countInStock <= quantity) {
        const quantity = existItem && existItem.quantity + 0 ;
        dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
      }
    } else {
      window.alert("product is out of stock");
    }
  };

  return (
    <Layout title="menu">
      <div className="container w-4/5 m-auto mt-28">
        <p className="text-normal font-bold mb-10">All Menu</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {product.map((product) => (
            <div
              key={product.slug}
              className="flex flex-col items-center rounded bg-split-menubg"
            >
              <div className="relative">
                <Link href={`/product/menu/${product.slug}`}>
                  <a>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded"
                    />
                  </a>
                </Link>
                {product.countInStock === 0 && (
                  <div className="w-full h-full absolute top-28">
                    <p className="p-5 bg-red-500 text-white text-center rounded-full font-semibold">
                      Product Not In Stock Now
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center text-white">
                <p>{product.name}</p>
                <p>${product.price}</p>
              </div>
              <button
                onClick={() => addToCartHandler(product)}
                className="linkText"
                type="button"
              >
                add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}


export async function getServerSideProps() {
  db.connect()
  const products = await Product.find().lean()
  db.disconnect()
  return {
    props: {
      products: JSON.parse(JSON.stringify(products.map(db.convertDocToObj)))
    }
  }
}