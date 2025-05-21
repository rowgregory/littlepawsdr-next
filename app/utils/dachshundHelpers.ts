export const extractYears = (str: string | undefined) => {
  if (!str) {
    return "n/a";
  }
  const match = str.match(/(\d+)\s*Years?/);
  if (match) {
    const years = match[1];
    return years === "1" ? "1 Year" : `${years} Years`;
  }
  return "n/a";
};

export const dachshundProfileGridData = (data: any) => [
  {
    title: "Name",
    textKey: data?.name,
  },
  {
    title: "Age",
    textKey: data?.ageString,
  },
  {
    title: "Gender",
    textKey: data?.sex,
  },
  {
    title: "Size",
    textKey: data?.sizeGroup,
  },
  {
    title: "Primary Color",
    textKey: data?.colorDetails,
  },
  {
    title: "Grooming Needs",
    textKey: data?.groomingNeeds,
  },
  {
    title: "Ok with kids",
    textKey: data?.isKidsOk ? "Yes" : "No",
  },
  {
    title: "Housetrained",
    textKey: data?.isHousetrained ? "Yes" : "No",
  },
  {
    title: "New People Reaction",
    textKey: data?.newPeopleReaction,
  },
  {
    title: "Vocal Level",
    textKey: data?.vocalLevel,
  },
  {
    title: "Ok with dogs",
    textKey: data?.isDogsOk ? "Yes" : "No",
  },
  {
    title: "Okay with cats",
    textKey: data?.isCatsOk ? "Yes" : "No",
  },
];
