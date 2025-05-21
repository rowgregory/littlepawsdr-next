interface UserInfoProps {
  _id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  isVolunteer?: boolean;
  avatar?: string;
  volunteerTitle?: string;
  volunteerEmail?: string;
  profileCardTheme?: string;
  online?: boolean;
  theme?: string;
  token?: string;
  confirmed?: boolean;
  publicId?: string;
}

export const NAVBAR_DATA = (userInfo?: UserInfoProps) => {
  const cartAndUserMenuItems = [];
  cartAndUserMenuItems.push(
    {
      title: "Donate",
      link: "/donate",
    },
    {
      title: "Cart",
      link: "/cart",
    },
    userInfo?._id
      ? {
          title: userInfo?.isAdmin ? "Avatar" : userInfo?._id && "Initials",
          links: userInfo?.isAdmin
            ? [
                { linkKey: "/admin", textKey: "Dashboard" },
                { linkKey: "/my-orders", textKey: "My Orders" },
                { linkKey: "/settings/profile", textKey: "Settings" },
              ]
            : userInfo?._id && [
                { linkKey: "/my-orders", textKey: "My Orders" },
                { linkKey: "/settings/profile", textKey: "Settings" },
              ],
        }
      : {
          title: "Login",
          link: "/login",
        }
  );
  return { cartAndUserMenuItems };
};
