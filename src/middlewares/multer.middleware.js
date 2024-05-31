import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
    cb(null, "./uploads");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
