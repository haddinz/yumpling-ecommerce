import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import Image from "next/image";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: true, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    case "DELIVERY_REQUEST":
      return { ...state, loadingDelivery: true };
    case "DELIVERY_SUCCESS":
      return { ...state, loadingDelivery: false, successDelivery: true };
    case "DELIVERY_FAIL":
      return { ...state, loadingDelivery: false };
    case "DELIVERY_RESET":
      return { ...state, loadingDelivery: false, successDelivery: false };
    default:
      state;
  }
}

export default function OrderScreen() {
  const { data: session } = useSession();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter();
  const orderId = query.id;
  const [
    {
      loading,
      order,
      error,
      successPay,
      loadingPay,
      loadingDelivery,
      successDelivery,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: "Fail Fecth Ordes From Data ",
        });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDelivery ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDelivery) {
        dispatch({ type: "DELIVERY_RESET" });
      }
    } else {
      const paypalScript = async () => {
        const { data: clientId } = await axios.get("/api/key/paypal");
        paypalDispatch({
          type: "resetOption",
          value: { client_id: clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      paypalScript();
    }
  }, [order, orderId, paypalDispatch, successDelivery, successPay]);
  const {
    shippingAddress,
    orderItems,
    paymentMethod,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    isDelivered,
    // paidAt,
    // deliveredAt,
  } = order;
  async function cashHandler() {
    try {
      dispatch({ type: "PAY_REQUEST" });
      const { data } = await axios.put(`/api/orders/${order._id}/payCOD`, {
        order,
      });
      dispatch({ type: "PAY_SUCCESS", payload: { data } });
      toast.success("Cash On Delivery Has Been Ordered");
    } catch (error) {
      dispatch({ type: "PAY_FAIL", message: "COD Failed" });
    }
  }
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid successfully");
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: { message: "Payment Fail" } });
        toast.error(error(402));
      }
    });
  }
  function onError(err) {
    toast.error(err("On Error Payment"));
  }
  async function deliveryOrderHandler() {
    try {
      dispatch({ type: "DELIVERY_REQUEST" });
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {}
      );
      dispatch({ type: "DELIVERY_SUCCESS", payload: data });
      toast.success("Order is Delivered");
    } catch (error) {
      dispatch({
        type: "DELIVERY_FAIL",
        payload: { message: "Delivery Order Failed" },
      });
    }
  }
  console.log("status isDelivered:", isDelivered)
  console.log("status isPaid:", isPaid)

  return (
    <Layout title={`Order ${orderId}`}>
      <div className="m-auto mt-24 mb-5 bg-footer-background p-5 rounded-lg w-11/12 md:max-w-6xl ">
        <h2 className="text-3xl font-bold text-center text-white">
          Order: {orderId}
        </h2>
      </div>
      <div className="w-11/12 md:max-w-6xl m-auto">
        {loading ? (
          <div>Loading.....</div>
        ) : error ? (
          <div>Something Wrong With Order Screen</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="col-span-2">
              <div className="card">
                <p className="subTitle">Shipping Address</p>
                {shippingAddress.name}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
                {!isDelivered ? (
                  <div className="alert mt-5"> Not On Delivery</div>
                ) : (
                  <div className="success mt-5"> On Delivery</div>
                )}
              </div>
              <div className="card">
                <p className="subTitle">Payment Method</p>
                <p> {paymentMethod} </p>
                {!isPaid && paymentMethod === "Cash On Delivery" ? (
                  <div className="warning mt-5">COD</div>
                ) : !isPaid ? (
                  <div className="alert mt-5">Not Paid Yet</div>
                ) : (
                  <div className="success mt-5">Is Paid</div>
                )}
              </div>
              <div className="card">
                <p className="subTitle">Order Items</p>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-5">Item</th>
                      <th className="text-center p-5">Quantity</th>
                      <th className="text-center p-5">Price</th>
                      <th className="text-center p-5">Sub Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item._id}>
                        <td className="flex items-center p-3">
                          <Image
                            width={60}
                            height={60}
                            alt={item.name}
                            src={item.image}
                          ></Image>
                          {item.name}
                        </td>
                        <td className="text-center p-3">{item.quantity}</td>
                        <td className="text-center p-3">{item.price}</td>
                        <td className="text-center p-3">
                          {item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="card">
                <p className="subTitle">Order Summary</p>
                <ul>
                  <li>
                    <div className="flex justify-between py-3">
                      <p>Items Price</p>
                      <p>$ {itemPrice}</p>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between py-3">
                      <p>Tax</p>
                      <p>$ {taxPrice}</p>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between pt-3 pb-5 mb-5 border-b">
                      <p>Shipping</p>
                      <p>$ {shippingPrice}</p>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between py-5">
                      <p>Total Price</p>
                      <p>$ {totalPrice}</p>
                    </div>
                  </li>
                  {!isPaid && (
                    <li>
                      {isPending ? (
                        <div>Loading ....</div>
                      ) : paymentMethod === "Cash On Delivery" ? (
                        <button
                          onClick={cashHandler}
                          className="button text-center w-full"
                        >
                          Approve COD
                        </button>
                      ) : (
                        <div className="w-full">
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <div>Loading....</div>}
                    </li>
                  )}
                  {session.user.isAdmin && isPaid && !isDelivered && (
                    <li>
                      {loadingDelivery && <div>Laoding....</div>}
                      <button
                        onClick={deliveryOrderHandler}
                        className="button text-center w-full"
                      >
                        Deliver Order Item
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

OrderScreen.auth = true;
