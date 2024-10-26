import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../user/user.schema';

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  expiry_date: Date;
}

export const refreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
