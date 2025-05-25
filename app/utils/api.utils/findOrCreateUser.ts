import User from "@models/userModel";

const findOrCreateUser = async (formData: any, session: any) => {
  let user = await User.findOne({ email: formData.email }).session(session);
  if (user) return user;

  user = new User({
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    name: `${formData.firstName} ${formData.lastName}`,
    isAdmin: false,
    hasSavedPaymentMethod: formData.hasSavedPaymentMethod || false,
  });

  try {
    await user.save({ session });
  } catch (err) {
    console.error("Error saving user:", err);
    throw err;
  }
  return user;
};

export default findOrCreateUser;
