import { v4, bcrypt } from "./../deps.ts";

import DB from "./../services/db.ts";
import { UserSchema } from "./../schema/index.ts";

class User {
  constrictor() {
  }

  collection = DB.collection("users");

  getAllUsers = async () => {
    const users = await this.collection.find({});

    return users;
  };

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
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

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

  login = async (user: UserSchema) => {
    const existedUser = await this.collection.findOne({ email: user.email });

    if (!existedUser) {
      console.log("No such user");
      return null;
    }

    const pwConfirmation = await bcrypt.compare(
      user.password,
      existedUser.password,
    );

    console.log(existedUser);

    console.log(user.password, existedUser.password);
    console.log(pwConfirmation);

    if (pwConfirmation) {
      return user;
    }
    return null;
  };

  updateUser = async (userId: string | undefined, changeData: UserSchema) => {
    const { matchedCount, modifiedCount, upsertedId } = await this.collection
      .updateOne({ _id: { $oid: userId } }, { $set: changeData });

    if (matchedCount) {
      return true;
    } else {
      return false;
    }
  };

  deleteUser = async (userId: string) => {
    const isUserDeleted = await this.collection.deleteOne({
      _id: { $oid: userId },
    });

    if (isUserDeleted) {
      return true;
    }

    return false;
  };
}

export default new User();
