import { Get, Controller } from "@nestjs/common";

// services.
import { AppService } from "src/app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}
