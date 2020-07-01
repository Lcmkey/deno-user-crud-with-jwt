// Defining schema interface
interface UserSchema {
  ukey?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LoginUserSchema {
  ukey?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserDataResultSchema {
  error: boolean;
  status: number;
  msg: string;
  data: LoginUserSchema;
}

export { UserSchema, UserDataResultSchema };
