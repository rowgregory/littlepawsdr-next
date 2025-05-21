import { Inputs, SetErrors } from "app/types/common.types";

interface ValidationErrors {
  title?: string;
  subtitle?: string;
  goal?: string;
  themeColor?: string;
}

const validateCampaignOverviewForm = (inputs: Inputs, setErrors: SetErrors) => {
  const newErrors: ValidationErrors = {};

  if (!inputs?.title?.trim()) {
    newErrors.title = "Title is required";
  }
  if (!inputs?.subtitle?.trim()) {
    newErrors.subtitle = "Subtitle is required";
  }
  if (!inputs?.goal) {
    newErrors.goal = "Goal is required";
  }
  if (!inputs?.themeColor) {
    newErrors.themeColor = "Theme color is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export default validateCampaignOverviewForm;
