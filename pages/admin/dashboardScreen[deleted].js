import axios from "axios";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
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
    summary: { salesData: []},
    error: ''
  })
  // bisa bisa nya loading error, mana tulisannya not found lagi
  // dan masih jadi misteri sampai sekarang kenapa di page
  // ini error cok seremin sumpah


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST " });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: " Fetch Data Summary Failed" });
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
      <div className="grid gap-5 md:grid-cols-4">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a>Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <a>Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a>Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a>Users</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h1>Admin Dashboard</h1>
          {loading ? (
            <div>Loading....</div>
          ) : error ? (
            <div className="alert">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card">
                  <p className="text-3xl">${summary.orderPrice}</p>
                  <p>Sales</p>
                  <Link className="linkText" href="/admin/orders">
                    <a>Sales Vies</a>
                  </Link>
                </div>
                <div className="card">
                  <p className="text-3xl">${summary.orderPrice}</p>
                  <p>Sales</p>
                  <Link className="linkText" href="/admin/orders">
                    <a>Sales Vies</a>
                  </Link>
                </div>
                <div className="card">
                  <p className="text-3xl">${summary.orderPrice}</p>
                  <p>Sales</p>
                  <Link className="linkText" href="/admin/orders">
                    <a>Sales Vies</a>
                  </Link>
                </div>
                <div className="card">
                  <p className="text-3xl">${summary.orderPrice}</p>
                  <p>Sales</p>
                  <Link className="linkText" href="/admin/orders">
                    <a>Sales Vies</a>
                  </Link>
                </div>
              </div>
              <h2>Sales Report</h2>
              <Bar
                options={{
                  legends: { display: true, position: "right" },
                }}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

DashboardScreen.auth = { adminOnly: true };
export default DashboardScreen