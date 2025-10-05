import { Module } from "@nestjs/common";

// modules.
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/users/user.module";
import { TasksModule } from "src/tasks/tasks.module";
import { AppConfigModule } from "src/config/config.module";
import { DatabaseModule } from "src/database/database.module";

// controllers.
import { AppController } from "src/app.controller";

// services.
import { AppService } from "src/app.service";

@Module({
  imports: [
    AuthModule,
    UserModule,
    TasksModule,
    DatabaseModule,
    AppConfigModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
