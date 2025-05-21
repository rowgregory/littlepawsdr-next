import { Inputs, SetErrors } from "app/types/common.types";

interface ValidationErrors {
  title?: string;
}

const validateCreateCampaignForm = (inputs: Inputs, setErrors: SetErrors) => {
  const newErrors: ValidationErrors = {};

  if (!inputs?.title?.trim()) {
    newErrors.title = "Title is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export default validateCreateCampaignForm;
