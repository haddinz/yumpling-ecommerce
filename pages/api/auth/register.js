import User from "../../../models/User";
import db from "../../../utils/db";
import bcryptjs from "bcryptjs"

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const { email, name, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Validation Error on Register API",
    });
    return;
  }

  await db.connect();
  const exixtUser = await User.findOne({ email: email });
  if (exixtUser) {
    res.status(422).json({
      message: "Email Already Exixts",
    });
    await db.disconnect()
    return;
  }

  const newUser = new User({
    name,
    email,
    password : bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect()
  res.status(201).send({
    message: "User Has Been Created",
    _id: user._id,
    name: user.name,
    password: user.password,
    isAdmin: user.iaAdmin
  })
};

export default handler;
