import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import Layout from "../components/Layout";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, laoding: false, error: action.payload };
    default:
      state;
  }
}

function Filter() {
  const [{ loading, product, error }, dispatch] = useReducer(reducer, {
    loading: true,
    product: [],
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/filter");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FECTH_FAIL", payload: "fecth data filter failed" });
      }
    };

    fetchData();
  }, []);

  const defaultItem = product.map((x) => {x.name})
  const [selected, setSelected ] = useState(defaultItem)
  const categories = [...new Set(product.map((item) => item.category))];
  console.log("isinya:", selected);
  return (
    <Layout>
      <div className="mt-32 m-auto max-w-6xl">
        {loading ? (
          <div>Loading....</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="grid grid-cols-3">
            <div>
              <p className="text-lg font-semibold">FIlter</p>
              <form>
                {categories.map((categories) => (
                  <div key={categories._id}>
                    <input
                      type="checkbox"
                      id={categories}
                      autoFocus
                      checked={selected === categories}
                      onChange={() => setSelected(categories)}
                    />
                    <label htmlFor={categories}>{categories}</label>
                  </div>
                ))}
              </form>
            </div>

            <div className="card col-span-2">
              {product
                .filter((x) => x.category === selected)
                .map((product) => (
                  <div key={product._id} className="card">
                    <div>
                      <p>{product.name}</p>
                    </div>
                    <div>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <p>$ {product.price}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

Filter.auth = true;
export default Filter;
