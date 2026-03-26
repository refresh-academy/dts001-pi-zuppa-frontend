import { NavLink } from "react-router";
import type { SidebarConfig } from "../types/piuzuppa";

type SidebarItemProps = {
  path: string;
  label: string;
  subItems?: { label: string; path: string }[];
};

const SidebarItem = ({ path, label, subItems }: SidebarItemProps) => {
  const asterisk = <span className="text-bordeaux leading-none text-lg">*</span>;

  return (
    <li className="relative group list-none">
      <NavLink
        to={`/${path}`}
        className={({ isActive }: { isActive: boolean }) =>
          `flex items-center gap-2 px-6 py-1 font-chalk transition-colors duration-200 ${
            isActive ? "text-giallo bg-bordeaux/20" : "text-giallo/90 hover:bg-bordeaux/40"
          }`
        }
        style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.3), 1px 1px 1px rgba(0,0,0,0.2)" }}
      >
        {asterisk}
        <span>{label}</span>
      </NavLink>

      {/* The Sub-Chalkboard */}
      {subItems && (
        <div className="invisible group-hover:visible absolute left-full top-0 ml-2 z-50 min-w-[240px]">
          <div 
            className="p-4 rounded-xs border-8 border-y-amber-900 border-x-amber-800 shadow-2xl"
            style={{
              backgroundColor: "#0a0a0a",
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 80%)
              `,
            }}
          >
            <ul className="space-y-3">
              {subItems.map((sub, i) => (
                <li key={i} className="flex items-center gap-2 group/sub">
                   {/* Mini chalky white asterisk for the sub-menu */}
                   <span className="text-giallo">*</span>
                   <NavLink 
                    to={`/${sub.path}`}
                    className="text-white font-chalk text-sm hover:text-giallo transition-colors block"
                    style={{ textShadow: "0 0 3px rgba(255, 255, 255, 0.4)" }}
                   >
                    {sub.label}
                   </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* Subtle "connector" arrow pointing back to the father link */}
          <div className="absolute top-4 -left-2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-amber-900" />
        </div>
      )}
    </li>
  );
};

type SidebarProps = {
  sidebarItems: SidebarConfig[];
};

export const Sidebar = ({ sidebarItems }: SidebarProps) => {
  return (
    <div 
      className="sticky top-0 h-min py-4 w-max ml-4 mt-6 rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 shadow-2xl"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)
        `,
      }}
    >
      {/* Decorative Chalk Corner Stains */}
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-linear-to-tr from-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-12 h-12 bg-linear-to-bl from-white/5 to-transparent pointer-events-none" />
      
      <ul className="relative z-10 space-y-1 px-3">
        {sidebarItems.map((item) => (
          <SidebarItem 
            key={item.key} 
            path={item.path} 
            label={item.label} 
            subItems={item.subItems} 
          />
        ))}
      </ul>
    </div>
  );
};
