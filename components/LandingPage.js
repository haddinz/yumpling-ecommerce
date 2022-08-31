/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative mb-40">
      <div className="grid grid-cols-2 m-auto w-11/12 md:max-w-6xl">
        <div>
          <div className="invisible md:visible w-52 h-52 bg-yellow-300 rounded-full absolute top-24 left-20 filter blur-xl opacity-50 -z-10 animate-blob"></div>
          <div className="mt-36 w-96">
            <p className="text-sm font-semibold">Designed by insinyur</p>
            <h1 className="text-5xl font-bold leading-tight">
              Delicious Taste Refreshing and Natural
            </h1>
            <p className="text-base font-normal leading-8">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="mt-10">
            <Link href="/product/menu">
              <button
                className="px-10 py-4 bg-button hover:bg-emerald-800 text-white rounded"
                type="button"
              >
                Order Now
              </button>
            </Link>
          </div>
        </div>

        <div className="pt-28">
          <div>
            <img
              className="invisible md:visible"
              src="/asset/assetsHomepage/itemMenu.png"
              alt="homepage"
            />
          </div>
        </div>
      </div>

      <div className="invisible lg:visible absolute top-0 right-0">
          <div className="h-550 w-100">
            <div className="w-full h-full flex flex-col justify-center items-center text-white text-base absolute">
              <Link href="/facebook.com">
                <a className="pb-12">fb</a>
              </Link>
              <Link href="/twitter.com">
                <a className="pb-12">tw</a>
              </Link>
              <Link href="/instagram.com">
                <a className="pb-12">ig</a>
              </Link>
              <Link href="/youtube.com">
                <a className="pb-12">yt</a>
              </Link>
            </div>
            <img src="/asset/assetsHomepage/rectangle.svg" alt="svg-rounded" />
          </div>
        </div>

    </div>
  );
}
