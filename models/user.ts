import { v4, bcrypt } from "./../deps.ts";

import DB from "./../services/db.ts";
import { UserSchema } from "./../schema/index.ts";

class User {
  constrictor() {
  }

  collection = DB.collection("users");

  hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  };

  // Get All Users
  getAllUsers = async () => {
    const users: Array<UserSchema> = await this.collection.find();

    return users;
  };

  // Get All Users
  getUserByUkey = async (ukey: string | undefined) => {
    console.log(ukey);

    const user: UserSchema = await this.collection.findOne({ ukey });

    // Delete sensitive info here
    if (user) {
      delete user.password;
    }

    return user;
  };

  // Create User
  register = async (user: UserSchema) => {
    const { email, password } = user;

    // Check user existed
    const existedUser = await this.collection.findOne({ email });

    if (existedUser) {
      return { data: "User already exists", error: true, status: 400 };
    }

    const ukey = v4.generate();
    const createdAt = new Date();
    const updatedAt = null;
    const hashPassword = await this.hashPassword(password);

    const newUser = {
      ukey,
      email,
      password: hashPassword,
      createdAt,
      updatedAt,
    };

    // Insert User Data to db
    await this.collection.insertOne(
      newUser,
    );

    // Get back created user data
    const userData = await this.collection.findOne({ ukey });
    delete userData.password;

    return {
      data: userData,
      error: false,
      status: 201,
    };
  };

  // User Login
  login = async (user: UserSchema) => {
    // Check User Existed
    const existedUser = await this.collection.findOne({ email: user.email });

    if (!existedUser) {
      return { error: true, status: 404, msg: "User not found" };
    }

    // Check Password Correct or not
    const pwConfirmation = await bcrypt.compare(
      user.password,
      existedUser.password,
    );

    if (pwConfirmation) {
      return { error: false, status: 200, msg: "Success" };
    }

    return { error: true, status: 400, msg: "Email / Password incorrect" };
  };

  // Update User
  updateUser = async (ukey: string | undefined, changeData: UserSchema) => {
    const { password } = changeData;
    if (password) {
      changeData.password = await this.hashPassword(password);
    }

    console.log(changeData);

    const { matchedCount, modifiedCount, upsertedId } = await this.collection
      .updateOne({ ukey }, { $set: changeData });

    if (matchedCount) {
      return { error: false, status: 200, msg: "success" };
    }

    return { error: false, status: 200, msg: "Update Fail" };
  };

  // Delete User
  deleteUser = async (ukey: string) => {
    const isUserDeleted = await this.collection.deleteOne({ ukey });

    if (isUserDeleted) {
      return { error: false, status: 200, msg: "Success" };
    }

    return { error: true, status: 400, msg: "Delete Fail" };
  };
}

export default new User();
