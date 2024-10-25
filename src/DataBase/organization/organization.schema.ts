import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../user/user.schema';

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ default: [], ref: User.name })
  organization_members: Types.ObjectId[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
