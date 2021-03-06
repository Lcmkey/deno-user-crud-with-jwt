import { v4, bcrypt } from "./../deps.ts";

import DB from "./../services/DB.ts";
import { UserSchema, UserDataResultSchema } from "./../schema/index.ts";

const FILE_PATH = "user.json";
const decoder = new TextDecoder();

const Users = DB.collection("users");

const User = {
  hashPassword: async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  },

  // get Mockup Data
  getMockupData: async () => {
    const data = await Deno.readFile(`${Deno.cwd()}/data/${FILE_PATH}`);
    let users = JSON.parse(decoder.decode(data));

    return users;
  },

  // Get All Users
  getAllUsers: async (): Promise<Array<UserSchema>> => {
    const users: Array<UserSchema> = await Users.find();

    return users;
  },

  // Get All Users
  getUserByUkey: async (ukey: string | undefined): Promise<UserSchema> => {
    const user: UserSchema = await Users.findOne({ ukey });

    // Delete sensitive info here
    if (user) {
      delete user.password;
    }

    return user;
  },

  // Create User
  register: async (user: UserSchema): Promise<UserDataResultSchema> => {
    const { email, password } = user;

    // Check user existed
    const existedUser = await Users.findOne({ email });
    let result = { error: false, status: 200, msg: "Success", data: {} };

    if (existedUser) {
      result = {
        ...result,
        error: true,
        status: 400,
        msg: "User already exists",
      };

      return result;
    }

    const ukey = v4.generate();
    const createdAt = new Date();
    const updatedAt = null;
    const hashPassword = await User.hashPassword(password);

    const newUser = {
      ukey,
      email,
      password: hashPassword,
      createdAt,
      updatedAt,
    };

    // Insert User Data to db
    await Users.insertOne(newUser);

    // Get back created user data
    const userData = await Users.findOne({ ukey });
    delete userData.password;

    result = { ...result, error: false, status: 201, data: userData };

    return result;
  },

  // User Login
  login: async (user: UserSchema): Promise<UserDataResultSchema> => {
    // Check User Existed
    const existedUser = await Users.findOne({ email: user.email });
    let result = { error: false, status: 200, msg: "Success", data: {} };

    if (!existedUser) {
      result = {
        ...result,
        error: true,
        status: 404,
        msg: "User not found",
      };

      return result;
    }

    // Check Password Correct or not
    const pwConfirmation = await bcrypt.compare(
      user.password,
      existedUser.password,
    );

    if (pwConfirmation) {
      result = { ...result, data: existedUser };

      return result;
    }

    return {
      ...result,
      error: true,
      status: 400,
      msg: "Email / Password incorrect",
    };
  },

  // Update User
  updateUser: async (
    ukey: string | undefined,
    changeData: UserSchema,
  ): Promise<UserDataResultSchema> => {
    let result = { error: false, status: 200, msg: "Success", data: {} };
    const { password } = changeData;

    if (password) {
      changeData.password = await User.hashPassword(password);
    }

    const { matchedCount, modifiedCount, upsertedId } = await Users
      .updateOne({ ukey }, { $set: changeData });

    if (matchedCount) {
      return result;
    }

    return { ...result, error: false, status: 400, msg: "Update Fail" };
  },

  // Delete User
  deleteUser: async (ukey: string): Promise<UserDataResultSchema> => {
    let result = { error: false, status: 200, msg: "Success", data: {} };
    const isUserDeleted = await Users.deleteOne({ ukey });

    if (isUserDeleted) {
      return result;
    }

    return { ...result, error: true, status: 400, msg: "Delete Fail" };
  },
};

export { User };
