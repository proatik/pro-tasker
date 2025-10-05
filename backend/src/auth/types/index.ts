import { FormattedUser } from "src/users/types";

export type AuthenticatedUser = {
  token: string;
  message: string;
  user: FormattedUser;
};
