import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, laodingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, laodingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, laodingDelete: false };
    case "DELETE_RESET":
      return { ...state, laodingDelete: false, successDelete: false };
    default:
      state;
  }
}

function AdminUserScreen() {
  const [{ loading, users, error, laodingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/user");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: "Fetch User Failed" });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);
  const deleteHandler = async (id) => {
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/user/${id}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Delete User Successfully");
    } catch (error) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error("Delete User Failed");
    }
  };

  return (
    <Layout title="Admin User Dashboard">
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
            <li className="nonActive">
              <Link href="/admin/products">
                <a className="font-bold text-black">Prodcuts</a>
              </Link>
            </li>
            <li className="active">
              <Link href="/admin/users">
                <a className="font-bold text-white">Users</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 card mt-5">
          {laodingDelete && "Loading..."}
          {loading ? (
            <div>Loading....</div>
          ) : error ? (
            <div>fetch User Failed</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-5">ID</th>
                    <th className="text-left p-5">NAME</th>
                    <th className="text-left p-5">EMAIL</th>
                    <th className="text-left p-5">ADMIN</th>
                    <th className="text-left p-5">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="py-2 px-5">
                        {user._id.substring(20, 34)}
                      </td>
                      <td className="py-2 px-5">{user.name}</td>
                      <td className="py-2 px-5">{user.email}</td>
                      <td className="py-2 px-5">
                        {user.isAdmin ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-5">
                        <button
                          className="buttonAlert"
                          onClick={() => deleteHandler(user._id)}
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

AdminUserScreen.auth = { onlyAdmin: true };
export default AdminUserScreen;
