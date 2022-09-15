/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import Product from "../models/Product";
import db from "../utils/db";

export default function Search({ products }) {
  const router = useRouter();
  const { query } = router;
  const choseItem = products.filter(
    (product) => product.category === query.category
  );

  return (
    <Layout title={`Menu ${query.category}`}>
      <div className="containerBox">
        <div className="text-3xl font-bold text-center text-white">
          <h1>Menu {query.category}</h1>
        </div>
      </div>
      <div className="placeContent flex justify-around">
        {choseItem.map((product) => (
          <div key={product.slug}>
            <div className="rounded bg-split-menubg w-60 flex flex-col items-center">
              <Link href={`/product/menu/${product.slug}`}>
                <a>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded"
                  />
                </a>
              </Link>

              <div className="p-5 w-full text-white flex flex-col items-center">
                <Link href={`/menu/product/${product.slug}`}>
                  <a>
                    <h2 className="text-lg">{product.name}</h2>
                  </a>
                </Link>
                <p>${product.price}</p>
                <Link href={`/product/menu/${product.slug}`}>
                  <button
                    className="text-link font-semibold mt-3 hover:text-amber-300"
                    type="button"
                  >
                    see more
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  db.connect();
  const products = await Product.find().lean();
  db.disconnect();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products.map(db.convertDocToObj))),
    },
  };
}
