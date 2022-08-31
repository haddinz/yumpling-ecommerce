/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Delivery() {
  return (
    <div className="scroll-mt-48 my-40" id="delivery">
      <div className="bg-delivery grid grid-cols-1 lg:grid-cols-2">

        <div className="w-11/12 h-96 m-auto md:w-[475px] ">
          <div className="text-white relative pt-14">
            <img
              className=" absolute -top-14 -left-14 invisible lg:visible"
              src="/asset/assetsDelivery/icon.svg"
              alt="delivery"
            />
            <h2 className="text-sm font-semibold">DELIVERY</h2>
            <h1 className="text-3xl font-bold">
              Serve Delivery Within The City
            </h1>
            <p className="text-base my-10">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit,
              <br />
              sed do eiusmod tempor incididunt ut labore et
              <br />
              dolore magna aliqua.
            </p>
            <Link href="/product/menu">
              <button className="w-36 h-14 bg-footer-background rounded-md hover:bg-hover">
                Order Now
              </button>
            </Link>
          </div>
        </div>

        <div className=" relative h-96 bg-blue-400">
          <Image
            src={"/asset/assetsDelivery/motion.gif"}
            alt="assetDelivery"
            layout='fill'
            objectFit="cover"
          ></Image>
        </div>

      </div>
    </div>
  );
}
