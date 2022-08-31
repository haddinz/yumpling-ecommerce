/* eslint-disable @next/next/no-img-element */
import Layout from "../components/Layout";
import LandingPage from "../components/LandingPage";
import ProductItems from "../components/ProductItems";
import Link from "next/link";
import Delivery from "./delivery";
import Testimonials from "./testimonials";
import db from "../utils/db";
import Product from "../models/Product";
// import data from "../utils/data";

export default function Home({ products }) {
  return (
    <Layout title="homepage">
      <LandingPage />

      <div className="my-40">
        <div className="container w-11/12 mx-auto relative md:max-w-6xl">
          <img
            className="absolute -top-20 -left-20 -z-10 invisible lg:visible"
            src="/asset/assetsMenu/mieIcon.svg"
            alt="noodle-icon"
          />
          <div className="absolute bg-lime-300 w-full h-96 rounded-full filter blur-xl opacity-20 -z-10"></div>
          <p className="text-sm font-bold">Menu</p>
          <h2 className="text-3xl font-bold mb-5">Our Best Menu on Request</h2>
          <p className="text-sm font-normal leading-8 max-w-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 container m-auto">
          {products
            .filter((product) => product.request === "populer")
            .map((product) => (
              <ProductItems product={product} key={product.slug}></ProductItems>
            ))}
        </div>

        <div className="w-full flex justify-center p-5 mt-10">
          <Link href="/product/menu">
            <p className="text-link font-semibold hover:text-amber-400 cursor-pointer">
              see all menu
            </p>
          </Link>
        </div>
      </div>

      <Delivery />
      <Testimonials />
    </Layout>
  );
}

export async function getServerSideProps() {
  db.connect();
  const products = await Product.find().lean();
  db.disconnect();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products.map(db.convertDocToObj)))
    },
  };
}

