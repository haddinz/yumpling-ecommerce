/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import Product from "../models/Product";
import db from "../utils/db";

const prices = [
  {
    name: "$1 to $10",
    value: "1-10",
  },
  {
    name: "$11 to $20",
    value: "11-20",
  },
  {
    name: "$21 to $40",
    value: "21-40",
  },
];

const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const router = useRouter();
  const {
    query = "all",
    category = "all",
    request = "all",
    price = "all",
    sort = "featured",
    rating = "all",
  } = router.query;
  const { products, countProducts, categories, requestItem } = props;
  const filterSearch = ({
    category,
    request,
    price,
    sort,
    rating,
    min,
    max,
    seacrhQuery,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (category) query.category = category;
    if (request) query.request = request;
    if (price) query.price = price;
    if (sort) query.sort = sort;
    if (rating) query.rating = rating;
    if (seacrhQuery) query.seacrhQuery = seacrhQuery;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;
    router.push({
      pathname: path,
      query: query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const requestHandler = (e) => {
    filterSearch({ request: e.target.value });
  };
  const pricesHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingsHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.sort });
  };

  return (
    <Layout title={`Menu ${query.category}`}>
      <div className="containerBox">
        <div className="text-3xl font-bold text-center text-white">
          <h1>Menu {query.category}</h1>
        </div>
      </div>
      <div className="placeContent grid grid-cols-1 gap-5 md:grid-cols-3 ">
        <div className="md:col-span-1">
          <p className="font-bold text-lg mb-5">Filter</p>
          <div className="mb-5">
            <label
              htmlFor={category}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Category
            </label>
            <select
              value={category}
              id={categories}
              onChange={categoryHandler}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all">All</option>
              {categories &&
                categories.map((category) => (
                  <option key={category._id} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-5">
            <label
              htmlFor={request}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Request
            </label>
            <select
              value={request}
              id={requestItem}
              onChange={requestHandler}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all">All</option>
              {requestItem &&
                requestItem.map((request) => (
                  <option key={request._id} value={request}>
                    {request}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-5">
            <label
              htmlFor={price}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Prices
            </label>
            <select
              value={price}
              id={prices}
              onChange={pricesHandler}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all">All</option>
              {prices.map((price) => (
                <option key={price.value} value={price.value}>
                  {price.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label
              htmlFor={rating}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Ratings
            </label>
            <select
              value={rating}
              id={ratings}
              onChange={ratingsHandler}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all">All</option>
              {ratings.map((rating) => (
                <option className="flex" key={rating} value={rating}>
                  {rating}
                  <span> &amp; Up</span>
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <div className="flex justify-between items-center">
              <div>
                {products.length === 0 ? 'No' : countProducts} Results
                {query !== 'all' && query !== '' && ':' + query}
                {category !== 'all' && " : " + category}
              </div>
            </div>
            <div>
              <label
                htmlFor={sort}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Ratings
              </label>
              <select
                value={sort}
                onChange={sortHandler}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="toprated">Costumer Reviews</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="font-bold text-lg mb-10">Menu</p>
          <div className="grid place-items-center gap-3 md:grid-cols-2 md:max-h-96 md:overflow-y-auto">
            {products.map((product) => (
              <div key={product._id}>
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
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  await db.connect();
  const category = query.category || "";
  const request = query.request || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const sort = query.sort || "";
  const seacrhQuery = query.query || "";

  const queryFilter =
    seacrhQuery && seacrhQuery !== "all"
      ? {
          name: {
            $regex: seacrhQuery,
            $option: "i",
          },
        }
      : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const requestFilter = request && request !== "all" ? { request } : {};
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  const order =
    sort === "featured"
      ? { featured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "toprates"
      ? { rating: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct("category");
  const requestItem = await Product.find().distinct("request");
  const productDocs = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...requestFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .lean();
  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...requestFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  await db.disconnect();

  // const products = productDocs.map(db.convertDocToObj);
  const products = JSON.parse(
    JSON.stringify(productDocs.map(db.convertDocToObj))
  );

  return {
    props: {
      products,
      countProducts,
      categories,
      requestItem,
    },
  };
}
