import axios from "axios";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/summary");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: "Fecth Data Summary Failed" });
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id),
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(162, 222, 1)",
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="containerBox">
        <h2 className="text-3xl font-bold text-center text-white">
          Admin Dashboard
        </h2>
      </div>
      <div className="placeContent grid grid-cols-1 md:grid-cols-4 md:gap-5">
        <div className="md:col-span-1">
          <ul>
            <li className="active">
              <Link href="/admin/dashboard">
                <a className="font-bold text-white">Dashboard</a>
              </Link>
            </li>
            <li className="nonActive font-bold text-black">
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li className="nonActive font-bold text-black">
              <Link href="/admin/products">Products</Link>
            </li>
            <li className="nonActive font-bold text-black">
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>

        <div className="col-span-3">
          {loading ? (
            <div>Loading....</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-4 md:gap-5 mb-5">
                <div className="card text-sm md:text-lg">
                  <p>${summary.ordersPrice}</p>
                  <p>Sales</p>
                </div>
                <div className="card text-sm md:text-lg">
                  <p>{summary.orderCount}</p>
                  <p>Orders</p>
                </div>
                <div className="card text-sm md:text-lg">
                  <p>{summary.productCount}</p>
                  <p>Products</p>
                </div>
                <div className="card text-sm md:text-lg">
                  <p>{summary.userCount}</p>
                  <p>Users</p>
                </div>
              </div>
              <div className="card">
              <h2 className="font-bold">Sales Report</h2>
              <Bar
                options={{
                  legends: { display: true, position: "right" },
                }}
                data={data}
              />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

DashboardScreen.auth = { adminOnly: true };
export default DashboardScreen;
