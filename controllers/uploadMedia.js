const StatusCodes = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadMedia = async (req, res) => {
  console.log(req.body);
  res.header("Access-Control-Allow-Origin", "*");
  const { media } = req.body;
  if (!media) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "Media missing" });
  }
  cloudinary.uploader.upload(media, (err, result) => {
    if (err) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, msg: "Media not uploaded" });
    }
    const { secure_url } = result;
    return res
      .status(StatusCodes.OK)
      .json({ success: true, media: secure_url });
  });
};

module.exports = uploadMedia;
