import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get<string>("JWT_SECRET")
      });

      request.userId = userId;
      return true;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      } else {
        throw new UnauthorizedException("Invalid or expired token");
      }
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers["authorization"];

    if (authHeader && typeof authHeader === "string") {
      const [scheme, token] = authHeader.split(" ");

      if (scheme === "Bearer" && token) {
        return token;
      }
    }

    return null;
  }
}
