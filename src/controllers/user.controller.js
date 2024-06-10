import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details from frontend
  // 2. validation  - not empty
  // check if user already exists: username , email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refesh token field from response
  // check for user creation
  // return response

  // get user details from frontend
  const { fullName, email, password, username } = req.body;
  console.log("req.body: ", req.body);

  // 2. validation  - not empty
  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username , email
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  // check for images, check for avatar
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // check for images, check for avatar
  const avatarLocalPath =
    req.files?.avatar[0]?.destination +
    "/" +
    req.files?.avatar[0]?.originalname;
  console.log(avatarLocalPath, "avatarLocalPathavatarLocalPath");

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath =
      req.files.coverImage[0].destination +
      "/" +
      req.files.coverImage[0].originalname;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them to cloudinary, avatar

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refesh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User regitered successfully"));
});

const test = async (req, res) => {
  const { name } = req.body;

  console.log(name, "mame");

  await res.status(200).json({
    message: "Test successfully",
    name,
  });
};

export { registerUser, test };
