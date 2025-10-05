import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

// schemas.
import { User, UserSchema } from "./schemas/user.schema";

// controllers.
import { UserController } from "./user.controller";

// services.
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
