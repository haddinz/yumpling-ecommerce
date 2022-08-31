/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const profile = [
  {
    id: "1",
    name: "Isyanto R",
    desc: "'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'",
    image: "/asset/assetTestimonial/1.png",
    role: "Designer",
  },
  {
    id: "2",
    name: "Ruslan Ramli",
    desc: "'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'",
    image: "/asset/assetTestimonial/2.png",
    role: "Graphic Designer",
  },
  {
    id: "3",
    name: "Melissa N",
    desc: "'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'",
    image: "/asset/assetTestimonial/3.png",
    role: "Senior Figma",
  },
  {
    id: "4",
    name: "Jhon Doe",
    desc: "'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'",
    image: "/asset/assetTestimonial/4.png",
    role: "Traveler",
  },
  {
    id: "5",
    name: "Ilham Hukum",
    desc: "'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'",
    image: "/asset/assetTestimonial/5.png",
    role: "Just A Man",
  },
];

export default function Testimonials() {
  return (
    <div className="mb-20">
      <div className="flex flex-col items-center w-full mb-16">
        <div className="flex flex-col items-center relative">
          <img
            src="/asset/assetTestimonial/bakso.svg"
            alt="mieIcon"
            className="-z-10 absolute -top-12 -left-14 invisible md:visible"
          />
          <h2 className="text-sm font-bold">TESTIMONIAL</h2>
          <p className="text-3xl font-bold mb-10">What They Are Saying?</p>
        </div>
        <div>
          <p className="text-base text-center">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, <br /> sed
            do eiusmod tempor incididunt ut labore et <br />
            dolore magna aliqua.
          </p>
        </div>
      </div>

      <div className="relatif">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            0 :{
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768 :{
              slidesPerView: 2,
              spaceBetween: 15,
            },
          }}
          className="h-80 max-w-5xl"
        >
          {profile.map((profile, index) => (
            <SwiperSlide key={index}>
              <div className="rounded-lg bg-slate-300 m-auto p-5 w-96">
                <div className="w-24 text-center">
                  <Image
                    alt={profile.id}
                    src={profile.image}
                    width={60}
                    height={60}
                    className="rounded-full"
                  ></Image>
                  <p className="font-semibold text-sm">{profile.name}</p>
                </div>
                <div className="flex flex-col text-center">
                  <span className="m-5">{profile.desc}</span>
                  <p className="font-semibold text-sm">{profile.role}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
