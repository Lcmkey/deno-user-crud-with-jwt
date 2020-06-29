import { bcrypt } from "./../deps.ts";

import DB from "./../services/db.ts";

interface User {
  email: string;
  password: string;
}

class UserClass {
  constrictor() {
  }

  collection = DB.collection("users");

  register = async (user: User) => {
    const { email, password } = user;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const result = await this.collection.insertOne(
      { email, password: hashPassword },
    );

    return console.log("User has been created.");
  };

  login = async (user: User) => {
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

  updateUser = async (userId: string, changeData: User) => {
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

export default new UserClass();
