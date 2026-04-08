import { Search } from "lucide-react";
import { useNavigate } from "react-router";

type RicercaTabellaProps = {
  title: string;
  columns: string[];
  rows: { id: string; data: string[] }[];
  onSearchChange: (value: string) => void;
  onEdit?: (id: string) => void;
  onRowClick?: (id: string) => void;
};

export function RicercaTabella({
  title,
  columns,
  rows,
  onSearchChange,
  onEdit,
  onRowClick,
}: RicercaTabellaProps) {
  const navigate = useNavigate();

  return (
    <div
      className="top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 py-8 pr-8 shadow-2xl"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)",
      }}
    >
      <h1 className="pl-8 text-2xl font-bold text-giallo">{title}</h1>

      <form
        className="grid grid-cols-2 gap-x-12 gap-y-6 p-8 items-end"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex w-full max-w-3xl flex-row items-center gap-4">
          <label className="text-lg font-bold text-bianco">
            Cerca per nome
          </label>
          <div className="relative flex-1">
            <input
              id="name"
              type="text"
              placeholder="nome"
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 w-full rounded-xl border-2 border-bordeaux bg-sabbia pr-14 pl-4 text-bordeaux shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] outline-none placeholder:text-bordeaux/70 focus:border-amber-800"
            />
            <div className="pointer-events-none absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-amber-900 bg-giallo/80 text-bordeaux shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              <Search size={16} strokeWidth={2.4} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/nuovo-utente")}
            className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] px-5 py-2 font-bold text-amber-950 shadow-[0_6px_0_0_#5c3417,0_10px_18px_rgba(92,52,23,0.28)] transition duration-150 hover:-translate-y-1 active:translate-y-1"
          >
            Nuovo
          </button>
        </div>
      </form>

      <div className="px-8">
        <div className="overflow-hidden rounded-2xl border-2 border-amber-900 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
          <table className="w-full border-collapse text-left">
            <thead className="bg-bordeaux text-giallo">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-sm font-bold uppercase tracking-wide"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-sabbia text-bordeaux">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.id) : undefined}
                  className={`border-t-2 border-amber-900/40 ${onRowClick ? "cursor-pointer hover:bg-amber-100/70 transition-colors" : ""}`}
                >
                  <td className="px-4 py-3"></td>
                  {row.data.map((cell, i) => (
                    <td key={i} className="px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
