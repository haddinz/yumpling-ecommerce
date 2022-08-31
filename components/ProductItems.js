/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

export default function ProductItems({ product }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded bg-split-menubg w-60 flex flex-col items-center">
        <Link href={`/product/menu/${product.slug}`}>
          <a>
            <img src={product.image} alt={product.name} className="rounded" />
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
  );
}
