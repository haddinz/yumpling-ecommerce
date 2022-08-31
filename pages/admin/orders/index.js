import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../../../components/Layout";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: true, error: action.payload };
  }
}

function Orders() {
  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/orders");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: { message: " Failed fetch data from api orders " },
        });
      }
    };

    fetchData();
    // console.log("data nya:", orders);
  }, []);
  return (
    <Layout title="Orders Admin Dashboard">
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
            <li className="active">
              <Link href="/admin/orders">
                <a className="font-bold text-white">Orders</a>
              </Link>
            </li>
            <li className="nonActive">
              <Link href="/admin/products">
                <a className="font-bold text-black">Prodcuts</a>
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
            <div>Laoding.....</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="card">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-5">ID</th>
                    <th className="text-left p-5">USER</th>
                    <th className="text-left p-5">DATE</th>
                    <th className="text-left p-5">TOTAL</th>
                    <th className="text-left p-5">PAID</th>
                    <th className="text-left p-5">DELIVERED</th>
                    <th className="text-left p-5">ACTION</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-scroll h-100">
                  {orders.map((order) => (
                    <tr className="text-sm" key={order._id}>
                      <td className="p-5">{order._id.substring(20, 24)}</td>
                      <td className="p-5">
                        {order.user ? order.user.name : "User Deleted"}
                      </td>
                      <td className="p-5">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-5">$ {order.totalPrice}</td>
                      <td className="p-5">
                        {order.isPaid &&
                        order.paymentMethod === "Cash On Delivery" ? (
                          <div className="warning">COD Approved</div>
                        ) : order.isPaid ? (
                          <div className="success">
                            `{order.paidAt.substring(0, 10)}`
                          </div>
                        ) : (
                          <div className="alert">Not Paid Yet</div>
                        )}
                      </td>
                      <td className="p-5">
                        {order.isDelivered ? (
                          <div className="success">
                            <p>Delivered At</p>
                            <span>`{order.deliveredAt.substring(0, 10)}`</span>
                          </div>
                        ) : (
                          "Not Delivered Yet"
                        )}
                      </td>
                      <td className="p-5">
                        <Link href={`/order/${order._id}`} passHref>
                          <a className="linkText">Details</a>
                        </Link>
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

Orders.auth = { onlyAdmin : true }
export default Orders
