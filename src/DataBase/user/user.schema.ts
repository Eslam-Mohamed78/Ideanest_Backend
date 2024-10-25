import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../../enum/user.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String, lowercase: true, unique: true })
  email: string;

  @Prop({ required: true, type: String, select: false })
  password: string;

  @Prop({ required: true, type: String, enum: UserRole })
  access_level: string;
}

export const userSchema =
  SchemaFactory.createForClass(User);
