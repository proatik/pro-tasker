import { Module } from "@nestjs/common";

// modules.
import { UserModule } from "src/users/user.module";
import { JwtConfigModule } from "src/jwt/jwt.module";

// controllers.
import { AuthController } from "src/auth/auth.controller";

// services.
import { AuthService } from "src/auth/auth.service";

@Module({
  imports: [UserModule, JwtConfigModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
