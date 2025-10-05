import { omit } from "lodash";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  Injectable,
  NotFoundException,
  ConflictException
} from "@nestjs/common";

// types.
import { FormattedUser } from "src/users/types";

// schemas.
import { User } from "src/users/schemas/user.schema";

// dto.
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<FormattedUser> {
    const { email } = createUserDto;
    let user = await this.findUserByEmail(email);

    if (!user) {
      const newUser = new this.userModel(createUserDto);

      await newUser.save();

      user = this.formatUser(newUser, ["password"]);
    } else if (user) {
      throw new ConflictException("User already exist with this email");
    }

    return user;
  }

  async getUsers(): Promise<FormattedUser[]> {
    const users = await this.userModel.find();

    return users.map((user) => this.formatUser(user, ["password"]));
  }

  async findUserByEmail(email: string): Promise<FormattedUser | null> {
    const user = await this.userModel.findOne({ email }).exec();

    return user ? this.formatUser(user) : null;
  }

  async findUserById(userId: string): Promise<FormattedUser> {
    const user = await this.userModel.findOne({ _id: userId }).exec();

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    return this.formatUser(user);
  }

  private formatUser(user: User, props: string[] = []): FormattedUser {
    const userData = user.toObject();

    return {
      ...omit(userData, ["_id", "__v", "createdAt", "updatedAt", ...props]),
      userId: userData._id.toString()
    };
  }
}
