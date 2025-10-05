import { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String })
  userId: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String })
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
