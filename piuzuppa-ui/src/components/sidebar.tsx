/* import { NavLink } from "react-router"
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
          `flex gap-2 px-2 py-1 font-semibold ${isActive
            ? "bg-rose-500 text-white hover:bg-rose-400"
            : "text-rose-100 hover:bg-rose-700"}`
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
    <div className="sticky top-0 h-screen border-r border-rose-800 bg-rose-900 py-4">
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
 */