import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: "" };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function Products() {
  const router = useRouter();
  const [
    { loading, products, error, loadingCreate, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/products");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: { message: "Fetch Data API Admin Products Failed" },
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const creteItemHandler = async () => {
    if (!window.confirm("Are You Sure?")) {
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post("/api/admin/products");
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Create New Product Successfully");
      router.push(`/admin/products/${data.products._id}`);
    } catch (error) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error("Failed Create Product");
    }
  };

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Product deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error('Product deleted failed');
    }
  };

  return (
    <Layout title="Products Admin Dashboard">
      <div className="containerBox">
        <h2 className="text-3xl font-bold text-center text-white">
          Admin Dashboard
        </h2>
      </div>
      <div className="placeContent grid grid-cols-1 md:grid-cols-4 md:gap-5">
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

        <div className="col-span-3">
          {loading ? (
            <div>Loading....</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="card overflow-x-auto">
              <div>
                {loadingDelete && <div>Deleting Item.......</div>}
                <button className="button" onClick={creteItemHandler}>
                  {loadingCreate ? "Loading......" : "Create"}
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-5">ID</th>
                    <th className="text-left p-5">NAME</th>
                    <th className="text-left p-5">PRICE</th>
                    <th className="text-left p-5">CATEGORY</th>
                    <th className="text-left p-5">COUNT</th>
                    <th className="text-left p-5">RATING</th>
                    <th className="text-center p-5">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {products.map((products) => (
                    <tr key={products._id}>
                      <td className="py-2 px-5">
                        {products._id.substring(20, 24)}
                      </td>
                      <td className="py-2 px-5">{products.name}</td>
                      <td className="py-2 px-5">{products.price}</td>
                      <td className="py-2 px-5">{products.category}</td>
                      <td className="py-2 px-5">{products.countInStock}</td>
                      <td className="py-2 px-5">{products.rating}</td>
                      <td className="py-2 px-5 flex">
                        <Link href={`/admin/products/${products._id}`}>
                          <a className=" mr-2">
                            <button className="button">Edit</button>
                          </a>
                        </Link>
                        <button
                          className="buttonAlert"
                          type="button"
                          onClick={() => deleteHandler(products._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

Products.auth = { onlyAdmin: true };
export default Products;
