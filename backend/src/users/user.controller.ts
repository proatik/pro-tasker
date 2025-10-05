import { Get, Controller, UseGuards } from "@nestjs/common";

// guards.
import { AuthGuard } from "src/auth/guards/auth.guard";

// services.
import { UserService } from "src/users/user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllUsers() {
    return this.userService.getUsers();
  }
}
