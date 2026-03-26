import { NavLink } from "react-router"; // Ensure correct import for your version
import type { SidebarConfig } from "../types/piuzuppa";

type SidebarItemProps = {
  path: string;
  label: string;
};

const SidebarItem = ({ path, label }: SidebarItemProps) => {

  const asteriskCircle = (
    <span className=" text-bordeaux leading-none ">
      *
    </span>
  );

  return (
    <li className="text-nowrap">
      <NavLink
        to={`/${path}`}
        className={({ isActive }: { isActive: boolean }) =>
          `flex gap-2 px-6 py-1 font-chalk transition-colors duration-200 ${
            isActive ? "text-giallo bg-bordeaux/20" : "text-giallo/90 hover:bg-bordeaux/40"
          }`
        }
        // Subtle chalk bleed/glow effect
        style={{ textShadow: "0 0 5px rgba(255, 1000, 255, 0.3), 1px 1px 1px rgba(0,0,0,0.2)" }}
      >
        {asteriskCircle} {label}
      </NavLink>
    </li>
  );
};

type SidebarProps = {
  sidebarItems: SidebarConfig[];
};

export const Sidebar = ({ sidebarItems }: SidebarProps) => {
  return (
    <div 
      className="sticky top-0 ml-4 mt-6 h-[65vh] w-min gap-16 overflow-hidden rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 py-8 shadow-2xl shadow-black"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)
        `,
      }}
    >
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-linear-to-tr from-pink-500/20 via-yellow-500/20 to-transparent -rotate-45 transform translate-y-6 -translate-x-6" />
      
      <ul className="relative z-10 space-y-4 px-4">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.key} path={item.path} label={item.label} />
        ))}
      </ul>
    </div>
  );
};
