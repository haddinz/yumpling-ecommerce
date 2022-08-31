/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";
import { Store } from "../utils/store";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";
import axios from "axios";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [color, setColor] = useState(false);
  const [category, setCategory] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, b) => a + b.quantity, 0));
  }, [cart.cartItems]);
  const navColorChange = () => {
    if (window.scrollY >= 20) {
      setColor(true);
    } else {
      setColor(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", navColorChange);
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/category");
        setCategory(data);
      } catch (error) {
        console.log('Fectd Categories')
      }
    };
    fetchCategories();
  }, []);

  const [closeNav, setCloseNav] = useState(false);
  const navHandler = () => {
    setCloseNav(true);
  };
  const navCloseHandler = () => {
    setCloseNav(false);
  };
  const signoutHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - yumpling.com" : "yumpling.com"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="top-center" limit={1} />

      <div className="flex flex-col justify-between min-h-[100vh] relative z-50">
        <header
          className={
            color
              ? "bg-neutral-800 fixed w-full z-50 text-white"
              : "bg-transparent w-full z-50 fixed"
          }
        >
          <nav className="container m-auto flex justify-between items-center h-20 w-11/12 md:max-w-6xl font-semibold">
            <Link href="/">
              <a className="text-2xl font-bold">insinyur.food</a>
            </Link>
            <nav className="hidden md:inline text-base">
              <Link href="/">
                <a className="px-4">Home</a>
              </Link>
              <Menu as="div" className="relative inline-block">
                <Menu.Button className="px-4">Menu</Menu.Button>
                <Menu.Items
                  className={
                    color
                      ? "absolute top-7 right-5 card bg-white text-black w-48"
                      : "absolute top-7 right-5 card bg-white w-48"
                  }
                >
                  {category.map((category) => (
                    <Menu.Item
                      key={category}
                      className="w-full hover:bg-slate-100 block p-2 rounded-sm"
                    >
                      <DropdownLink
                        href={`/search?category=${category}`}
                        className=" w-full"
                      >
                        {category}
                      </DropdownLink>
                    </Menu.Item>
                  ))}
                  <Menu.Item className="w-full hover:bg-slate-100 block p-2 rounded-sm">
                      <DropdownLink href="/product/menu" className=" w-full">
                        See All Menu
                      </DropdownLink>
                    </Menu.Item>
                </Menu.Items>
              </Menu>
              <Link href="/#delivery">
                <a className="px-4">Delivery</a>
              </Link>
              <Link href="/cart">
                <a className="px-4 relative">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute bg-red-600 text-white rounded-full -top-2 right-0 text-xs px-2 py-1">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === "Loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="px-4">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items
                    className={
                      color
                        ? "absolute top-7 right-5 card bg-white text-black w-64"
                        : "absolute top-7 right-5 card bg-white w-64"
                    }
                  >
                    <Menu.Item className="w-full hover:bg-slate-100 block p-2 rounded-sm">
                      <DropdownLink href="/profile" className=" w-full">
                        Manage Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item className="w-full hover:bg-slate-100 block p-2 rounded-sm">
                      <DropdownLink href="/orderHistory">
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session?.user.isAdmin && (
                      <Menu.Item className="w-full hover:bg-slate-100 block p-2 rounded-sm">
                        <DropdownLink href="/admin/dashboardScreen">
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <span className="w-full h-1 bg-slate-500 inline-block rounded-lg"></span>
                    <Menu.Item className=" w-full hover:bg-slate-100 block p-2 my-4 rounded-sm">
                      <DropdownLink href="#" onClick={signoutHandler}>
                        Sign Out
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="px-4">Login</a>
                </Link>
              )}
            </nav>
            <div
              className={
                !closeNav
                  ? "flex flex-col cursor-pointer md:hidden"
                  : "invisible animate-ping 2s"
              }
              onClick={navHandler}
            >
              <span
                className={
                  color
                    ? "w-7 border-white border-2 mb-1"
                    : "w-7 border-black border-2 mb-1"
                }
              ></span>
              <span
                className={
                  color
                    ? "w-7 border-white border-2 mb-1"
                    : "w-7 border-black border-2 mb-1"
                }
              ></span>
              <span
                className={
                  color
                    ? "w-7 border-white border-2 mb-1"
                    : "w-7 border-black border-2 mb-1"
                }
              ></span>
            </div>
          </nav>
          <nav
            className={
              closeNav
                ? "w-full h-full backdrop-blur-sm bg-slate-900/90 cursor-pointer fixed top-0"
                : "hidden"
            }
            onClick={navCloseHandler}
          >
            <div className="relatif grid justify-items-end mt-9 mr-6">
              <span className="w-7 border-white border-2 mb-1 rotate-45 absolute"></span>
              <span className="w-7 border-white border-2 mb-1 -rotate-45 absolute"></span>
            </div>
            <nav className="text-white text-base font-semibold w-full grid justify-items-end mt-24">
              <Link href="/">
                <a className="pb-6 mr-6">Home</a>
              </Link>
              <Link href="/product/menu">
                <a className="pb-6 mr-6">Menu</a>
              </Link>
              <Link href="#deliveryPage">
                <a className="pb-6 mr-6">Delivery</a>
              </Link>
              <Link href="/login">
                <a className="pb-6 mr-6">Login/SignUp</a>
              </Link>
            </nav>
            <div className="flex justify-end mt-11">
              <a
                href="https//:facebook.com"
                className="mr-11 text-white font-semibold text-base"
              >
                fb
              </a>
              <a
                href="https//:facebook.com"
                className="mr-11 text-white font-semibold text-base"
              >
                ig
              </a>
              <a
                href="https//:facebook.com"
                className="mr-11 text-white font-semibold text-base"
              >
                tw
              </a>
              <a
                href="https//:facebook.com"
                className="mr-11 text-white font-semibold text-base"
              >
                yt
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="relative h-96">
          <div className="bg-footer-background flex items-center justify-center flex-col absolute w-full bottom-0">
            <div className="absolute left-0 -top-24 invisible -z-10 md:visible">
              <img src="/asset/assetFooter/fruitsIcon1.svg" alt="svgFooter" />
            </div>
            <div className="container text-white m-auto flex items-center justify-center flex-col z-10">
              <div className="mt-5">
                <p className="font-bold text-5xl ">Get in touch</p>
              </div>
              <nav className="flex flex-col items-center my-5">
                <Link href="/">
                  <a className="font-bold text-2xl">insinyur.food</a>
                </Link>
                <nav className="mt-4 w-60 flex justify-between text-base">
                  <Link href="/instagram.com">
                    <a>ig</a>
                  </Link>
                  <Link href="/twitter.com">
                    <a>tw</a>
                  </Link>
                  <Link href="/facebook.com">
                    <a>fb</a>
                  </Link>
                  <Link href="/youtube.com">
                    <a>yt</a>
                  </Link>
                </nav>
              </nav>
              <div className="my-14">
                <p className="text-sm">
                  © 2022 Your Company, Inc. All rights reserved.
                </p>
              </div>
            </div>
            <div className="absolute container z-0 truncate h-72">
              <img src="/asset/assetFooter/kekie.svg" alt="svgFooter" />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
