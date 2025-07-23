import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "",
    items: [
      {
        title: "Home",
        icon: Icons.HomeIcon,
        oAuth: false,
        items: [
          {
            title: "Social Media",
            url: "/social",
          },

        ],
      },
      {
        title: "#Explore",
        url: "/social/explore",
        oAuth: false,
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Messages",
        url: "/social/message",
        oAuth: false,
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Notifications",
        url: "/social/notifications",
        oAuth: false,
        icon: Icons.Alphabet,
        items: [],
      },
      {
        title: "Bookmarks",
        url: "/social/bookmarks",
        oAuth: false,
        icon: Icons.Table,
        items: [],
      },

      {
        title: "Friends",
        url: "/social/friends",
        oAuth: false,
        icon: Icons.User,
        items: [],
      },
      {
        title: "Settings",
        url: "/social/settings",
        oAuth: false,
        icon: Icons.Authentication,
        items: [],
      },


    ],
  },
  {
    label: "OTHERS",
    items: [

      {
        title: "Authentication",
        icon: Icons.Authentication,
        oAuth: true,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
          {
            title: "Sign Up",
            url: "/auth/sign-up",
          },
        ],
      },
    ],
  },
];
