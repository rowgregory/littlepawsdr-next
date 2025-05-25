import { Types } from "mongoose";

interface Address {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipPostalCode?: string;
  country?: string;
}

export interface User {
  _id?: Types.ObjectId;
  campaigns: Types.ObjectId[];
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  confirmed?: boolean;
  shippingAddress?: Address;
  lastLoginTime?: string;
  firstNameFirstInitial?: string;
  lastNameFirstInitial?: string;
  firstName?: string;
  lastName?: string;
  anonymousBidding?: boolean;
  registrationConfirmationEmailSent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
