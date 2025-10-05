import { omit } from "lodash";
import { JwtService } from "@nestjs/jwt";
import { hash, compare } from "bcryptjs";
import { Injectable, UnauthorizedException } from "@nestjs/common";

// types.
import { AuthenticatedUser } from "src/auth/types";

// dto.
import { LoginDto } from "src/auth/dto/login.dto";
import { RegisterDto } from "src/auth/dto/register.dto";

// services.
import { UserService } from "src/users/user.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { fullName, email, password } = registerDto;

    const hashedPassword = await hash(password, 10);

    await this.userService.createUser({
      email,
      fullName,
      password: hashedPassword
    });

    return { message: "Registration successful" };
  }

  async login(loginDto: LoginDto): Promise<AuthenticatedUser> {
    const { email, password } = loginDto;

    let user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordMatched = await compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload = { email, userId: user.userId };
    const token = this.jwtService.sign(payload);

    user = { ...omit(user, ["password"]) };

    return { token, user, message: "Login successful" };
  }
}
