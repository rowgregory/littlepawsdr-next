import { Inputs, SetErrors } from "app/types/common.types";

interface ValidationErrors {
  coverPhoto?: string;
}

const validateCampaignCoverPhotoForm = (
  inputs: Inputs,
  setErrors: SetErrors
) => {
  const newErrors: ValidationErrors = {};

  if (!inputs?.coverPhoto?.trim()) {
    newErrors.coverPhoto = "Cover photo is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export default validateCampaignCoverPhotoForm;
