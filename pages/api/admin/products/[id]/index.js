import { getSession } from "next-auth/react";
import Product from "../../../../../models/Product";
import db from "../../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send({ message: "Admin SignIn Required" });
  }

  const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'PUT' ) {
    return putHandler(req, res, user)
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, user)
  }else {
    return res
      .status(401)
      .send({ message: "Method Admin Edit Product Not Allowed " });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

const putHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.request = req.body.request;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save()
    await db.disconnect()
    res.send({ message: 'Product Updated Successfully' })
  } else {
    res.status(400).send({ message: 'Product Not Found '})
  }
};

const deleteHandler = async (req, res) => {
  await db.connect()
  const product = await Product.findById(req.query.id)
  if(product){
    await product.remove()
    await db.disconnect()
    res.send({ message: 'Product Deleted Successfully' })
  } else {
    await db.disconnect()
    res.status(400).send({ message: 'Product not found'})
  }
}

export default handler;

//program akan error membaca coding jika {status} di 
//masukin dalam susunan program true 
//seperti contoh di atas.
//karna {status} hanya boleh berada di program false