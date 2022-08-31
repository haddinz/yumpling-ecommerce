import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = async (req, res) => {
  //ingat kalau pakai async itu await jangan dilupaaaaa, jadi errorkan
  const session = await getSession({ req });
  console.log(session);
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Signin Required");
  }

  await db.connect();
  const orderCount = await Order.countDocuments();
  const productCount = await Product.countDocuments();
  const userCount = await User.countDocuments();

  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  await db.disconnect();
  res.send({ orderCount, productCount, userCount, ordersPrice, salesData });
};

export default handler;
