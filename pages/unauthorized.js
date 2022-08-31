import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";

export default function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="Unauthorized Page">
      <div className="m-28">
        <p className="text-xl font-bold">Access Denied</p>
        {message && <p className="mb-4 text-red-700">{message}</p>}
      </div>
    </Layout>
  );
}
