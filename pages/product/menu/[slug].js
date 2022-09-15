/* eslint-disable jsx-a11y/alt-text */
import React, { useContext } from "react";
import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Store } from "../../../utils/store";
import axios from "axios";
import db from "../../../utils/db";
import Product from "../../../models/Product";
import { useRouter } from "next/router";
import Motion from "../../../styles/motion";
// import data from "../../../utils/data";

export default function ProductItems(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  // const { query } = router;
  // const { slug } = query;
  // const product = data.products.find((x) => x.slug === slug);
  if (!product) {
    return (
      <Layout>
        <diV className="text-lg font-bold max-w-5xl m-auto mt-36">
          <h1>Product Not Found</h1>
          <Link href="/product/menu">
            <a className="text-link font-semibold my-5 hover:text-amber-300 cursor-pointer">
              Back to Menu
            </a>
          </Link>
        </diV>
      </Layout>
    );
  }

  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock > 0) {
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === data.slug
      );
      const quantity = existItem ? existItem.quantity + 1 : 1;
      dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
      router.push("/cart");
      if (data.countInStock < quantity) {
        window.alert("Product Out Of Stock");
        const quantity = existItem && existItem.quantity + 0;
        dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
        return;
      }
    } else {
      window.alert("Product Its Empty, Come Back Later");
    }
  };

  return (
    <Layout title={product.name}>
      <Motion.parent>
        <div className="container w-4/5 m-auto mt-32">
          <div>
            <Link href={"/product/menu"}>
              <p className="text-link font-semibold my-5 hover:text-amber-300 cursor-pointer">
                back to menus
              </p>
            </Link>
          </div>
          <Motion.stagger>
            <div className="grid md:grid-cols-3 md:gap-3">
              <div className="relative flex justify-center">
                <Motion.img>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={250}
                    height={250}
                  ></Image>
                </Motion.img>
                {product.countInStock === 0 && (
                  <div className="w-full h-full absolute top-24 left-0">
                    <p className="p-5 bg-red-500 text-white text-center rounded-full font-semibold">
                      Product Not In Stock Now
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center p-5">
                <ul>
                  <Motion.fadeInUp>
                    <li>
                      <h2 className="text-2xl font-bold">{product.name}</h2>
                    </li>
                  </Motion.fadeInUp>
                  <Motion.fadeInUp>
                    <li>
                      <p className="text-base">{product.category}</p>
                    </li>
                    <li>
                      <p className="text-base">
                        {product.rating} of {product.numReviews} reviews
                      </p>
                    </li>
                    <li>
                      <p className="text-base">
                        Description : {product.desciptions}
                      </p>
                    </li>
                    <li>
                      <p className="text-base">
                        Count In Stock : {product.countInStock}
                      </p>
                    </li>
                  </Motion.fadeInUp>
                </ul>
              </div>

              <div className="flex flex-col justify-center">
                <Motion.fadeInUp>
                  <div className="m-2 shadow p-3">
                    <div className="flex justify-between mb-3 text-xl font-semibold">
                      <h2>Price</h2>
                      <h2>${product.price}</h2>
                    </div>
                    <div className="flex justify-between mb-3 text-xl font-semibold">
                      <h2>Stock</h2>
                      <h2>
                        {product.countInStock > 0
                          ? "available"
                          : "not available"}
                      </h2>
                    </div>

                    <button
                      className="font-semibold w-full bg-amber-300 hover:bg-amber-400 p-2 rounded text-white"
                      onClick={addToCartHandler}
                    >
                      {" "}
                      add to cart{" "}
                    </button>
                  </div>
                </Motion.fadeInUp>
              </div>
            </div>
          </Motion.stagger>
        </div>
      </Motion.parent>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  db.connect();
  const product = await Product.findOne({ slug }).lean();
  db.disconnect();
  return {
    props: {
      product: product
        ? JSON.parse(JSON.stringify(db.convertDocToObj(product)))
        : null,
    },
  };
}
