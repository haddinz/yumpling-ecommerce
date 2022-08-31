import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, laoding: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, error: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, error: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, error: action.payload };
    default:
      return state;
  }
}

function ProductsEdit() {
  const [{ loading, product, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      product: {},
      error: "",
    });
  const router = useRouter();
  const { query } = router;
  const productId = query.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        setValue("name", data.name);
        setValue("request", data.request);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("category", data.category);
        setValue("image", data.image);
        setValue("rating", data.rating);
        setValue("numReviews", data.numReviews);
        setValue("desciptions", data.desciptions);
        setValue("countInStock", data.countInStock);
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: "Fetch data API Admin Prodcuts Edit Failed ",
        });
      }
    };

    fetchData();
  }, [productId, setValue]);

  async function submitHandler({
    name,
    request,
    slug,
    price,
    category,
    image,
    rating,
    numReviews,
    desciptions,
    countInStock,
  }) {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        request,
        slug,
        price,
        category,
        image,
        rating,
        numReviews,
        desciptions,
        countInStock,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Update Product Successfully");
    } catch (error) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: { message: "Update Product Fail" },
      });
      toast.error("Update Product Failed");
    }
  }

  async function uploadHandler(e, imageField = "image") {
    // const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;
    const url = 'https://api.cloudinary.com/v1_1/insinyurdatabase/upload'
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinarySign");

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      // formData.append('api_key', process.env.CLOUDINARY_API_KEY);
      formData.append('api_key', '313239765518294');
      const { data } = await axios.post(url, formData);
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.secure_url);
      toast.success("File Uploaded Successfully");
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL" });
      toast.error("File Uploaded Failed");
    }
  }

  return (
    <Layout title={`Admin Edit Product ${productId}`}>
      <div className="containerBox">
        <h2 className="text-3xl font-bold text-center text-white">
          {`Edit Product ${product.name}`}
        </h2>
      </div>
      {loading ? (
        <div>Laoding...</div>
      ) : error ? (
        <div className="placeContent">{error}</div>
      ) : (
        <div className="placeContent grid gap-5 md:grid-cols-4">
          <div className="md:col-span-1">
            <ul>
              <li className="nonActive">
                <Link href="/admin/dashboardScreen">
                  <a className="font-bold text-black">Dashboard</a>
                </Link>
              </li>
              <li className="nonActive">
                <Link href="/admin/orders">
                  <a className="font-bold text-black">Orders</a>
                </Link>
              </li>
              <li className="active">
                <Link href="/admin/products">
                  <a className="font-bold text-white">Prodcuts</a>
                </Link>
              </li>
              <li className="nonActive">
                <Link href="/admin/users">
                  <a className="font-bold text-black">Users</a>
                </Link>
              </li>
            </ul>
          </div>

          <form
            className="text-white border-none card col-span-3"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className="mb-5">
              <Link href="/admin/products">
                <a className="linkText">Back</a>
              </Link>
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="name"
              >
                Name Product
              </label>
              <input
                type="text"
                id="name"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("name", {
                  required: "please enter name",
                  pattern: {
                    message: "please enter valid name",
                  },
                })}
              ></input>
              {errors.name && (
                <div className="text-red">{errors.name.message}</div>
              )}
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="request"
              >
                Request Product
              </label>
              <input
                type="text"
                id="request"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("request", {
                  required: "please enter request",
                  pattern: {
                    message: "please enter valid request",
                  },
                })}
              ></input>
              {errors.request && (
                <div className="text-red">{errors.request.message}</div>
              )}
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="image"
              >
                Image Product
              </label>
              <input
                type="text"
                id="image"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("image", {
                  required: "please enter image",
                  pattern: {
                    message: "please enter valid image",
                  },
                })}
              ></input>
              {errors.image && (
                <div className="text-red">{errors.image.message}</div>
              )}
            </div>
            <div className="my-4 text-black font-semibold text-xs">
              <label htmlFor="changeImage" className="button">Change Image</label>
              <input
                className="w-full mt-2"
                type="file"
                id="changeImage"
                onChange={uploadHandler}
                hidden
              />
              {loadingUpload && <span>Loading....</span>}
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="category"
              >
                category Product
              </label>
              <select
                type="text"
                id="category"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("category", {
                  required: "please enter category",
                  pattern: {
                    message: "please enter valid category",
                  },
                })}
              >
                {["food", "Drink"].map((category, index) => (
                  <option
                    key={index}
                    selected={category === "category"}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="text-red">{errors.category.message}</div>
              )}
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="slug"
              >
                Slug Product
              </label>
              <input
                type="text"
                id="slug"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("slug", {
                  required: "please enter slug",
                  pattern: {
                    message: "please enter valid slug",
                  },
                })}
              ></input>
              {errors.slug && (
                <div className="text-red">{errors.slug.message}</div>
              )}
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="rating"
              >
                Rating Product
              </label>
              <input
                type="text"
                id="rating"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("rating", {
                  required: "please enter rating",
                  pattern: {
                    message: "please enter valid rating",
                  },
                })}
              ></input>
              {errors.rating && (
                <div className="text-red">{errors.rating.message}</div>
              )}
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="numReviews"
              >
                Num Reviews Product
              </label>
              <input
                type="text"
                id="numReviews"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("numReviews", {
                  required: "please enter numReviews",
                  pattern: {
                    message: "please enter valid numReviews",
                  },
                })}
              ></input>
              {errors.numReviews && (
                <div className="text-red">{errors.numReviews.message}</div>
              )}
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="desciptions"
              >
                Description Product
              </label>
              <input
                type="text"
                id="desciptions"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("desciptions", {
                  required: "please enter desciptions",
                  pattern: {
                    message: "please enter valid desciptions",
                  },
                })}
              ></input>
              {errors.desciptions && (
                <div className="text-red">{errors.desciptions.message}</div>
              )}
            </div>
            <div className="flex flex-col mb-2 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="countInStock"
              >
                Count In Stock Product
              </label>
              <input
                type="text"
                id="countInStock"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("countInStock", {
                  required: "please enter countInStock",
                  pattern: {
                    message: "please enter valid countInStock",
                  },
                })}
              ></input>
              {errors.countInStock && (
                <div className="text-red">{errors.countInStock.message}</div>
              )}
            </div>
            <div className="flex flex-col mb-6 border-solid border-gray-600">
              <label
                className="pb-2 text-black font-semibold text-base"
                htmlFor="price"
              >
                Price Product
              </label>
              <input
                type="text"
                id="price"
                autoFocus
                className="p-2 rounded-md bg-stone-700"
                {...register("price", {
                  required: "please enter price",
                  pattern: {
                    message: "please enter valid price",
                  },
                })}
              ></input>
              {errors.price && (
                <div className="text-red">{errors.price.message}</div>
              )}
            </div>

            <div>
              <button className="button">
                {loadingUpdate ? "Loading..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}

ProductsEdit.auth = { onlyAdmin: true };
export default ProductsEdit;
