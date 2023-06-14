import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/dist/client/link";
import { useForm } from "react-hook-form";
import { getError } from "../utils/error";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn( 'credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error("Error Mas");
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="login">
      <div className="m-auto mt-28 bg-footer-background p-16 rounded-lg w-11/12 md:max-w-4xl ">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Login Screen
        </h2>
        <form
          className="text-white border-none"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="flex flex-col mb-6 border-solid border-gray-600">
            <label className="pb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoFocus
              className="p-2 rounded-md bg-stone-700"
              {...register("email", {
                required: "please enter email",
                pattern: {
                  value: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/i,
                  message: "please enter valid email",
                },
              })}
            ></input>
            {errors.email && (
              <div className="text-white">{errors.email.message}</div>
            )}
          </div>
          <div className="flex flex-col mb-6">
            <label className="pb-2" htmlFor="password">
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              autoFocus
              className="p-2 rounded-md bg-stone-700"
              {...register("password", {
                required: "please enter password",
                minLength: {
                  value: 6,
                  message: "password mush be more than 5 caracter",
                },
              })}
            ></input>
            {errors.password && (
              <div className="text-white">{errors.password.message}</div>
            )}
          </div>
          <div className="flex flex-col mb-6 mt-12">
            <button
              className="p-2 rounded-md bg-amber-300 hover:bg-amber-400 font-semibold "
            >
              Login
            </button>
          </div>
          <div>
            <p>
              Don&apos;t you have an account?&nbsp;{" "}
              <Link href={`/register?redirect=${redirect || '/'}`}>
                <span className="text-amber-300 cursor-pointer">register</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
