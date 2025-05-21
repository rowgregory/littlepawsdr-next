import AdoptionFee from "@models/adoptionFeeModel";

const filterActiveAdoptionFees = async (emailAddress: string) => {
  return await AdoptionFee.findOne({ emailAddress, token: { $ne: null } });
};

export { filterActiveAdoptionFees };
