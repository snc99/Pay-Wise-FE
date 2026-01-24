"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string; isActive?: boolean }[];
};

export function NavMain({
  features = [],
  settings = [],
}: {
  features?: NavItem[];
  settings?: NavItem[];
}) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {features.map((item) => {
            const hasChildren =
              Array.isArray(item.items) && item.items.length > 0;
            const open = Boolean(
              item.isActive || item.items?.some((si) => si.isActive)
            );

            // CASE 1: Item punya children -> render collapsible group (arrow present)
            if (hasChildren) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={open}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items!.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url ?? "#"}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // CASE 2: Item TIDAK punya children -> render direct link (no arrow)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  data-active={item.isActive}
                >
                  <Link
                    href={item.url ?? "#"}
                    className={`
      flex items-center gap-2 w-full rounded-md px-2 py-1.5
      transition-colors
      ${
        item.isActive
          ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-500"
          : "text-muted-foreground hover:bg-muted"
      }
    `}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>

      {/* Settings group (render hanya kalau ada item) */}
      {settings.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
          <SidebarMenu>
            {settings.map((item) => {
              const hasChildren =
                Array.isArray(item.items) && item.items.length > 0;
              const open = Boolean(
                item.isActive || item.items?.some((si) => si.isActive)
              );

              if (hasChildren) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={open}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items!.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url ?? "#"}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    data-active={item.isActive}
                  >
                    <Link
                      href={item.url ?? "#"}
                      className={`
      flex items-center gap-2 w-full rounded-md px-2 py-1.5
      transition-colors
      ${
        item.isActive
          ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-500"
          : "text-muted-foreground hover:bg-muted"
      }
    `}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  );
}
