"use client";

import { cn } from "../../../styles/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarSocialContext } from "./sidebar-context";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth";
import { ThemeToggleSwitch } from "../header/theme-toggle";

export function Sidebar() {
  const auth = useAuth();
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } =
    useSidebarSocialContext();
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
    <>
      <aside
        style={{ zIndex: 0 }}
        className={cn(
          "max-w-[290px] overflow-hidden bg-transparent p-0 transition-[width] duration-200 ease-linear dark:text-white/90 lg:p-4",
          isMobile ? "hidden" : "sticky top-0 h-screen",
          "w-full",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="base:rounded-lg flex h-full flex-col border border-gray-200 bg-white py-10 pl-[25px] pr-[7px] dark:border-gray-800 dark:bg-gray-900 md:rounded-none lg:rounded-lg">
          <div className="relative pr-4.5">
            {/* <Link
              href={"/admin"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link> */}

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
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
          </div>
        </div>
      </aside>
    </>
  );
}
