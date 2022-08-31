const cloudinary = require("cloudinary").v2;

export default function signature(req, res) {
  const apiSecret = 'MG3GjH0SrINgokAfRY9RBshPeR8'
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    // process.env.CLOUDINARY_API_SECRET
    apiSecret
  );

  res.statusCode = 200;
  res.json({ signature, timestamp });
}
