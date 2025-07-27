"use client";

import { SearchIcon } from "../../../assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarSocialContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { useAuth } from "@/context/auth";
import { useDrawer } from "@/context/drawer";
import { Sidebar } from "../sidebar";
import { NAV_DATA } from "../sidebar/data";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuItem } from "../sidebar/menu-item";
import { cn } from "@/styles/lib/utils";
import { ChevronUp } from "../sidebar/icons";

export function Header() {
  const auth = useAuth();

  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebarSocialContext();
  const { openDrawer, closeDrawer } = useDrawer();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }

            // Break the loop
            return true;
          }
        });
      });
    });
  }, [pathname]);
  return (
    <header className="sticky top-0 z-1 flex items-center justify-between gap-4 space-x-0 border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-900 md:px-5 2xl:px-10">
      <button
        onClick={() =>
          openDrawer(
            <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
              {NAV_DATA.map((section) => (
                <div key={section.label} className="mb-6">
                  <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                    {section.label}
                  </h2>

                  <nav role="navigation" aria-label={section.label}>
                    <ul className="space-y-2">
                      {section.items.map((item) => {
                        const condition = item.oAuth === !auth.isAuthenticated;
                        if (condition)
                          return (
                            <li key={item.title}>
                              {item.items.length ? (
                                <div>
                                  <MenuItem
                                    isActive={item.items.some(
                                      ({ url }) => url === pathname,
                                    )}
                                    onClick={() => toggleExpanded(item.title)}
                                  >
                                    <item.icon
                                      className="size-6 shrink-0"
                                      aria-hidden="true"
                                    />

                                    <span>{item.title}</span>

                                    <ChevronUp
                                      className={cn(
                                        "ml-auto rotate-180 transition-transform duration-200",
                                        expandedItems.includes(item.title) &&
                                          "rotate-0",
                                      )}
                                      aria-hidden="true"
                                    />
                                  </MenuItem>

                                  {expandedItems.includes(item.title) && (
                                    <ul
                                      className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                      role="menu"
                                    >
                                      {item.items.map((subItem) => (
                                        <li key={subItem.title} role="none">
                                          <MenuItem
                                            as="link"
                                            href={subItem.url}
                                            isActive={pathname === subItem.url}
                                          >
                                            <span>{subItem.title}</span>
                                          </MenuItem>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ) : (
                                (() => {
                                  const href =
                                    "url" in item
                                      ? item.url + ""
                                      : "/admin" +
                                        item.title
                                          .toLowerCase()
                                          .split(" ")
                                          .join("-");

                                  return (
                                    <MenuItem
                                      className="flex items-center gap-3 py-3"
                                      as="link"
                                      href={href}
                                      isActive={pathname === href}
                                    >
                                      <item.icon
                                        className="size-6 shrink-0"
                                        aria-hidden="true"
                                      />

                                      <span>{item.title}</span>
                                    </MenuItem>
                                  );
                                })()
                              )}
                            </li>
                          );
                      })}
                    </ul>
                  </nav>
                </div>
              ))}
              <ThemeToggleSwitch />
            </div>,
            {
              title: "Facebook Clone",
              position: "left",
              onClose: () => {},
            },
          )
        }
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] dark:text-white/90 hover:dark:bg-[#FFFFFF1A] sm:block md:hidden lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link
          href={"/social"}
          className="ml-2 max-[430px]:hidden min-[375px]:ml-4"
        >
          <Image
            src={"/images/logo/logo-icon.svg"}
            width={32}
            height={32}
            alt=""
            role="presentation"
          />
        </Link>
      )}

      <Link href={"/social"} className="w-64 max-xl:hidden">
        <h1 className="mb-0.5 text-heading-5 font-bold text-primary dark:text-cyan-800">
          FACEBOOK
        </h1>
        <p className="font-medium text-primary dark:text-cyan-800">Clone</p>
      </Link>
      <div className="pm-32 relative w-full max-w-[150px] lg:max-w-[300px]">
        <input
          type="search"
          placeholder="Search"
          className="flex h-10 w-full items-center gap-3.5 rounded-full border bg-gray-100 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:bg-gray-700 dark:text-white/90 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
        />

        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 dark:text-white/90 max-[1015px]:size-5" />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        {/* <ThemeToggleSwitch /> */}
        {auth.isAuthenticated && <Notification />}

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
