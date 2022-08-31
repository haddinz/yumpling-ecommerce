import { getSession } from "next-auth/react";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(400).send({ message: "SignIn Admin Required" });
  }


  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method Dont Allowed" });
  }

};

const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};

const postHandler = async (req, res) => {
  await db.connect();
  const newProducts = new Product({
    name: "sample-name",
    request: "popular or non-popular",
    slug: "sample-slug" + Math.random(),
    category: "sample category",
    image: "upload image",
    price: 0,
    rating: 0,
    numReviews: 0,
    desciptions: "sample-description",
    countInStock: 0,
  });
  const products = await newProducts.save();
  await db.disconnect();
  res.send({ message: "Product Created Successfully", products });
};

export default handler;
