import { NavLink } from "react-router"
import type { SidebarConfig } from "../types/piuzuppa"

type SidebarItemProps = {
  path: string,
  label: string,
}

const SidebarItem = ({ path, label }: SidebarItemProps) => {
  return (
    <li className="text-nowrap">
      <NavLink
        to={`/${path}`}
        className={({ isActive }: { isActive: boolean }) =>
          `flex gap-8 px-6 py-1 font-bold  ${isActive
            ? " text-black hover:bg-giallo"
            : "text-bordeaux hover:bg-giallo"}`
        }
      >
        {label}
      </NavLink>
    </li>
  )
}

type SidebarProps = {
  sidebarItems: SidebarConfig[]
}

export const Sidebar = ({ sidebarItems }: SidebarProps) => {
  return (
    <div className="sticky top-0 h-screen gap-16 bg-sabbia py-4 w-min border-l-14 border-salvia">
      <ul className="space-y-1 px-3">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.key}
            path={item.path}
            label={item.label}
          />
        ))}
      </ul>
    </div>
  )
}
