import { Search } from "lucide-react";
import { useNavigate } from "react-router";

type RicercaTabellaProps = {
  title: string;
  columns: string[];
  rows: { id: string; data: string[] }[];
  onSearchChange: (value: string) => void;
  onEdit?: (id: string) => void;
  onRowClick?: (id: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  showNewButton?: boolean;
  newButtonLabel?: string;
  newButtonPath?: string;
};

export function RicercaTabella({
  title,
  columns,
  rows,
  onSearchChange,
  onEdit,
  onRowClick,
  searchLabel = "Cerca per nome",
  searchPlaceholder = "nome",
  showNewButton = true,
  newButtonLabel = "Nuovo",
  newButtonPath = "/nuovo-utente",
}: RicercaTabellaProps) {
  const navigate = useNavigate();

  return (
    <div className="table-panel top-0 ml-4 mt-6 min-h-[60vh] w-full py-8 pr-8">
      <h1 className="pl-8 text-2xl font-bold text-giallo">{title}</h1>

      <form
        className="grid grid-cols-2 gap-x-12 gap-y-6 p-8 items-end"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex w-full max-w-3xl flex-row items-center gap-4">
          <label className="text-lg font-bold text-bianco">{searchLabel}</label>
          <div className="relative flex-1">
            <input
              id="name"
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 w-full rounded-xl border-2 border-bordeaux bg-sabbia pr-14 pl-4 text-bordeaux shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] outline-none placeholder:text-bordeaux/70 focus:border-amber-800"
            />
            <div className="pointer-events-none absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-amber-900 bg-giallo/80 text-bordeaux shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              <Search size={16} strokeWidth={2.4} />
            </div>
          </div>
          {showNewButton && (
            <button
              type="button"
              onClick={() => navigate(newButtonPath)}
              className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] px-5 py-2 font-bold text-amber-950 shadow-[0_6px_0_0_#5c3417,0_10px_18px_rgba(92,52,23,0.28)] transition duration-150 hover:-translate-y-1 active:translate-y-1"
            >
              {newButtonLabel}
            </button>
          )}
        </div>
      </form>

      {/* Table Section */}
      <div className="px-8">
        
        {/* Main Table Wrapper Box */}
        <div 
          className="relative rounded-b-3xl bg-[#fffdf9] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
          style={{
            clipPath: `polygon(
              0% 12px, 
              1% 12px, 1% 0px, 2% 0px, 2% 12px,
              3% 12px, 3% 0px, 4% 0px, 4% 12px,
              5% 12px, 5% 0px, 6% 0px, 6% 12px,
              7% 12px, 7% 0px, 8% 0px, 8% 12px,
              9% 12px, 9% 0px, 10% 0px, 10% 12px,
              11% 12px, 11% 0px, 12% 0px, 12% 12px,
              13% 12px, 13% 0px, 14% 0px, 14% 12px,
              15% 12px, 15% 0px, 16% 0px, 16% 12px,
              17% 12px, 17% 0px, 18% 0px, 18% 12px,
              19% 12px, 19% 0px, 20% 0px, 20% 12px,
              21% 12px, 21% 0px, 22% 0px, 22% 12px,
              23% 12px, 23% 0px, 24% 0px, 24% 12px,
              25% 12px, 25% 0px, 26% 0px, 26% 12px,
              27% 12px, 27% 0px, 28% 0px, 28% 12px,
              29% 12px, 29% 0px, 30% 0px, 30% 12px,
              31% 12px, 31% 0px, 32% 0px, 32% 12px,
              33% 12px, 33% 0px, 34% 0px, 34% 12px,
              35% 12px, 35% 0px, 36% 0px, 36% 12px,
              37% 12px, 37% 0px, 38% 0px, 38% 12px,
              39% 12px, 39% 0px, 40% 0px, 40% 12px,
              41% 12px, 41% 0px, 42% 0px, 42% 12px,
              43% 12px, 43% 0px, 44% 0px, 44% 12px,
              45% 12px, 45% 0px, 46% 0px, 46% 12px,
              47% 12px, 47% 0px, 48% 0px, 48% 12px,
              49% 12px, 49% 0px, 50% 0px, 50% 12px,
              51% 12px, 51% 0px, 52% 0px, 52% 12px,
              53% 12px, 53% 0px, 44% 0px, 54% 12px,
              55% 12px, 55% 0px, 56% 0px, 56% 12px,
              57% 12px, 57% 0px, 58% 0px, 58% 12px,
              59% 12px, 59% 0px, 60% 0px, 60% 12px,
              61% 12px, 61% 0px, 62% 0px, 62% 12px,
              63% 12px, 63% 0px, 64% 0px, 64% 12px,
              65% 12px, 65% 0px, 66% 0px, 66% 12px,
              67% 12px, 67% 0px, 68% 0px, 68% 12px,
              69% 12px, 69% 0px, 70% 0px, 70% 12px,
              71% 12px, 71% 0px, 72% 0px, 72% 12px,
              73% 12px, 73% 0px, 74% 0px, 74% 12px,
              75% 12px, 75% 0px, 76% 0px, 76% 12px,
              77% 12px, 77% 0px, 78% 0px, 78% 12px,
              79% 12px, 79% 0px, 80% 0px, 80% 12px,
              81% 12px, 81% 0px, 82% 0px, 82% 12px,
              83% 12px, 83% 0px, 84% 0px, 84% 12px,
              85% 12px, 85% 0px, 86% 0px, 86% 12px,
              87% 12px, 87% 0px, 88% 0px, 88% 12px,
              89% 12px, 89% 0px, 90% 0px, 90% 12px,
              91% 12px, 91% 0px, 92% 0px, 92% 12px,
              93% 12px, 93% 0px, 94% 0px, 94% 12px,
              95% 12px, 95% 0px, 96% 0px, 96% 12px,
              97% 12px, 97% 0px, 98% 0px, 98% 12px,
              99% 12px, 99% 0px, 100% 0px, 
              100% 100%, 0% 100%
            )`
          }}
        >
          <table className="w-full border-collapse text-left">
            {/* Subtle Minimal Ledger Header */}
            <thead className="bg-[#fffdf9] text-bordeaux/80">
              <tr>
                {/* Left Margin rule column header */}
                <th className="w-12 px-4 pt-8 pb-4 border-r border-bordeaux/20 relative bg-[#fffdf9]">
                  <div className="absolute right-3 top-0 bottom-0 w-[2px] bg-bordeaux/40"></div>
                </th>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 pt-8 pb-4 text-xs font-bold uppercase tracking-wider text-bordeaux/70 border-b-4 border-double border-bordeaux/30"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Harmonized Ledger Body */}
            <tbody className="text-bordeaux font-medium text-sm">
              {rows.length === 0 ? (
                <tr className="border-t border-bordeaux/20">
                  <td className="px-4 py-8 border-r border-bordeaux/20 relative bg-[#fffdf9]">
                    <div className="absolute right-3 top-0 bottom-0 w-[2px] bg-bordeaux/40"></div>
                  </td>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-bordeaux/60 bg-[#fffdf9]"
                  >
                    Nessun risultato trovato.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.id) : undefined}
                    /* 
                      Soft Mid-way Hover Effect:
                      - Keeps bordeaux text color for consistent contrast.
                      - Uses a solid, richer yellow-sabbia accent tone (#ecd9aa) to blend beautifully.
                    */
                    className={`border-t border-bordeaux/10 odd:bg-[#fffdf9] even:bg-[#faf4e4] transition-colors duration-150 ${
                      onRowClick ? "cursor-pointer hover:bg-[#ecd9aa]" : ""
                    }`}
                  >
                    {/* Left vertical Bordeaux margin line */}
                    <td className="px-4 py-3 border-r border-bordeaux/20 relative">
                      <div className="absolute right-3 top-0 bottom-0 w-[2px] bg-bordeaux/40"></div>
                    </td>
                    {row.data.map((cell, i) => (
                      <td key={i} className="px-4 py-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}

              {/* Physical Bottom Margin Row */}
              <tr className="border-t-4 border-double border-bordeaux/30 bg-[#fffdf9]">
                <td className="h-14 px-4 border-r border-bordeaux/20 relative">
                  <div className="absolute right-3 top-0 bottom-0 w-[2px] bg-bordeaux/40"></div>
                </td>
                <td colSpan={columns.length} className="h-14"></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
