// Defining schema interface
interface UserSchema {
  ukey?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export { UserSchema };
