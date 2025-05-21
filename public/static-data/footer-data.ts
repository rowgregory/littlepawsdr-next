import { clockIcon, dogIcon, envelopeIcon, mapPinIcon } from "app/icons";

const footerSections = [
  {
    title: "Quick Links",
    type: "link",
    data: [
      {
        linkKey: "/dachshunds",
        textKey: "Available Dachshunds",
      },
      {
        linkKey: "/adoption-application",
        textKey: "Adoption Application",
      },
      {
        linkKey: "/volunteer-application",
        textKey: "Volunteer Application",
      },
      {
        linkKey: "/surrender",
        textKey: "Surrender",
      },
    ],
  },
  {
    title: "Support Links",
    type: "button",
    data: [
      {
        linkKey:
          "https://www.privacypolicies.com/live/c37902bc-11cd-430e-a925-2b82ce905c88",
        textKey: "Privacy Policy",
      },
      {
        linkKey:
          "https://www.termsandconditionsgenerator.com/live.php?token=K9R7fXZjABJKZhIWlXr43oY6qca6jjVn",
        textKey: "Terms & Conditions",
      },
      {
        linkKey: "https://oag.ca.gov/privacy/ccpa",
        textKey: "California Consumer Privacy Act",
      },
      {
        linkKey: "/return-policy",
        textKey: "Return Policy",
      },
    ],
  },
  {
    title: "Locations",
    type: "location",
    data: [
      {
        icon: mapPinIcon,
        textKey: "Brookfield, CT 06804",
      },
      {
        icon: envelopeIcon,
        textKey: "lpdr@littlepawsdr.org",
      },
      {
        icon: clockIcon,
        textKey: "24/7",
      },
      {
        icon: dogIcon,
        textKey: "Rescue with love",
      },
    ],
  },
];

export { footerSections };
