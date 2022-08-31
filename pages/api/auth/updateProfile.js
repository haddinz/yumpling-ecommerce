import { getSession } from "next-auth/react";
import User from "../../../models/User";
import db from "../../../utils/db";
import bcryptjs from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(400).send({ message: " Sign In Required" });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (
    !name,
    !email,
    !email.includes("@") || (password && password.trim().length < 5)
  ) {
    res.status(422).json({
      message: "Validation Error",
    });
    return;
  }

  await db.connect();
  const update = await User.findById(user._id);
  update.name = name;
  update.email = email;

  if (password) {
    update.password = bcryptjs.hashSync(password);
  }

  await update.save();
  await db.disconnect();
  res.send({
    message: "User Updated",
  });
};

export default handler;
