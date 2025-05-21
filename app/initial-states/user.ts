import { User } from "app/types/model.types";

const initialAddressState = {
  name: "",
  address: "",
  city: "",
  state: "",
  zipPostalCode: "",
  country: "",
};

export const initialUserState: User = {
  campaigns: [],
  name: "",
  email: "",
  password: "",
  isAdmin: false,
  confirmed: false,
  shippingAddress: initialAddressState,
  lastLoginTime: "",
  firstNameFirstInitial: "",
  lastNameFirstInitial: "",
  firstName: "",
  lastName: "",
  anonymousBidding: false,
  registrationConfirmationEmailSent: false,
};
