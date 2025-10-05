import { User } from "src/users/schemas/user.schema";

type ExcludedProps = "_id" | "__v" | "createdAt" | "updatedAt";

export type FormattedUser = Omit<User, ExcludedProps> & {
  userId: string;
};
