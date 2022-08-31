import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../components/Layout";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: " " };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function OrderHistory() {
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: [],
    error: "",
  });
  useEffect(() => {
    const fetchOrderHostory = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/orders/orderHistory");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: { message: " Get History Order API Failed " },
        });
      }
    };
    fetchOrderHostory();
  }, []);

  return (
    <Layout title="Order Histori">
      <div className="m-auto mt-20 mb-10 bg-footer-background p-5 rounded-lg w-11/12 md:max-w-7xl ">
        <h2 className="text-3xl font-bold text-center text-white">
          Order History
        </h2>
      </div>
      <div className="w-11/12 m-auto md:max-w-7xl mb-20">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert">You Not Orders Products Yet</div>
        ) : (
          <div>
            <div className="card hidden lg:block">
              <table className="w-full text-sm ">
                <thead className="border-b">
                  <tr>
                    <th className="py-5 text-center border-r">No</th>
                    <th className="py-5 text-center">Id</th>
                    <th className="py-5 text-left">Items</th>
                    <th className="py-5 text-left">Payment</th>
                    <th className="py-5 text-left">Total</th>
                    <th className="py-5 text-left">Date</th>
                    <th className="py-5 text-left">Paid</th>
                    <th className="p-5 text-left">Delivery</th>
                    <th className="py-5 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {order.map((order, index) => (
                    <tr key={order._id}>
                      <td className="text-center border-r font-bold">
                        {index + 1}
                      </td>
                      <td className="py-2 text-center">
                        {order._id.substring(20, 24)}
                      </td>
                      <td className="py-2 text-center">
                        {order.orderItems.map((x) => (
                          <div key={x.name} className="text-left">
                            {x.name}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 text-left">{order.paymentMethod}</td>
                      <td className="py-2 text-left">$ {order.totalPrice}</td>
                      <td className="py-2 text-left">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="py-2 text-left">
                        {order.isPaid &&
                        order.paymentMethod === "Cash On Delivery" ? (
                          <div className="warning text-center">
                            COD Approved
                          </div>
                        ) : order.isPaid ? (
                          <div className="success text-center">
                            Paid At : {order.paidAt.substring(0, 10)}
                          </div>
                        ) : (
                          <div className="alert text-center">Not Paid Yet</div>
                        )}
                      </td>
                      <td className="p-5 text-left">
                        {order.isDelivered ? (
                          <div className="success">
                            <p>Delivered At</p>
                            <span>`{order.deliveredAt.substring(0, 10)}`</span>
                          </div>
                        ) : (
                          "Not Delivered Yet"
                        )}
                      </td>
                      <td className="py-2 text-left">
                        <Link href={`/order/${order._id}`} passHref>
                          <a className="linkText">Details</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {order.map((order) => (
              <div
                key={order._id}
                className="card text-sm flex flex-col lg:hidden"
              >
                <div className="flex justify-between mb-5">
                  <div>
                    <div className="successText mb-5">
                      {order._id.substring(20, 24)}
                    </div>
                    <div>
                      {order.orderItems.map((item) => (
                        <div key={item.name}>{item.name}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-5">
                      {order.createdAt.substring(0, 10)}
                    </div>
                    <div>$ {order.totalPrice}</div>
                  </div>
                </div>
                <div className="mb-5">
                  {order.isPaid &&
                  order.paymentMethod === "Cash On Delivery" ? (
                    <div className="warning text-center">COD Approved</div>
                  ) : order.isPaid ? (
                    <div className="success text-center">
                      Paid At : {order.paidAt.substring(0, 10)}
                    </div>
                  ) : (
                    <div className="alert text-center">Not Paid Yet</div>
                  )}
                </div>
                <div className="flex justify-between">
                  <div>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <div className="dangerText">Not Delivered Yet</div>
                    )}
                  </div>
                  <div>
                    <Link href={`/order/${order._id}`} passHref>
                      <a className="linkText">Details</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

OrderHistory.auth = true;
export default OrderHistory;
