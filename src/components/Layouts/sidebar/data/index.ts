import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        oAuth: false,
        items: [
          {
            title: "Social Media",
            url: "/admin",
          },
        ],
      },
      // {
      //   title: "Products",
      //   url: "/admin/products",
      //   oAuth: false,
      //   icon: Icons.FourCircle,
      //   items: [],
      // },
      // {
      //   title: "Categories",
      //   url: "/admin/categories",
      //   oAuth: false,
      //   icon: Icons.Alphabet,
      //   items: [],
      // },
      // {
      //   title: "Orders",
      //   url: "/admin/orders",
      //   oAuth: false,
      //   icon: Icons.Table,
      //   items: [],
      // },
      // {
      //   title: "Reviews",
      //   url: "/admin/reviews",
      //   oAuth: false,
      //   icon: Icons.User,
      //   items: [],
      // },
      {
        title: "Posts",
        url: "/admin/posts",
        oAuth: false,
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Users",
        url: "/admin/users",
        oAuth: false,
        icon: Icons.User,
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
