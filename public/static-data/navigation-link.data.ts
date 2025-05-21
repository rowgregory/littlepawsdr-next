import { isStringInPath } from "./string.functions";

interface AdminNavigationLink {
  textKey: string;
  linkKey: string | null;
  active: boolean;
}

export const adminNavigationLinkData = (
  path: string | null
): AdminNavigationLink[] => {
  // If path is null, return empty array or handle as necessary
  if (!path) {
    return [];
  }

  const links: AdminNavigationLink[] = [
    {
      textKey: "Dashboard",
      linkKey: "/admin/dashboard",
      active: isStringInPath(path, "dashboard"),
    },
    {
      textKey: "Campaigns",
      linkKey: "/admin/campaigns",
      active: isStringInPath(path, "campaigns"),
    },
    {
      textKey: "Orders",
      linkKey: "/admin/customer-orders/orders",
      active: isStringInPath(path, "orders"),
    },
    {
      textKey: "Donations",
      linkKey: "/admin/one-time-donations",
      active: isStringInPath(path, "one-time-donations"),
    },
    {
      textKey: "Store",
      linkKey: "/admin/store/ecards",
      active: isStringInPath(path, "store"),
    },
    {
      textKey: "Adoption Application",
      linkKey: "/admin/adoption-application/fees",
      active: isStringInPath(path, "adoption-application"),
    },
    {
      textKey: "Contacts",
      linkKey: "/admin/contacts/users",
      active: isStringInPath(path, "contacts"),
    },
  ];

  return links;
};
