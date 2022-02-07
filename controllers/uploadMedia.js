const StatusCodes = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadMedia = async (req, res) => {
  const { media } = req.body;
  if (!media) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "Media missing" });
  }
  cloudinary.uploader.upload(
    media,
    {
      max_size: "3mb",
    },
    (err, result) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ success: false, msg: "Media not uploaded" });
      }
      const { secure_url } = result;
      res.status(StatusCodes.OK).json({ success: true, media: secure_url });
    }
  );
};

module.exports = uploadMedia;
