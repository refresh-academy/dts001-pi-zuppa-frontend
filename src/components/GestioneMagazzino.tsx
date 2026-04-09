import { useState } from "react";
import { RicercaTabella } from "./RicercaTabella";

const columns = ["Nome prodotto", "Unita", "Peso", "Scadenza"];

const staticRows = [
  { id: "1", data: ["pippo", "2", "", "6/11/2027"] },
  { id: "2", data: ["pluto", "5", "", "11/2026"] },
  { id: "3", data: ["paperino", "", "10 kg", ""] },
  { id: "4", data: ["minnie", "4", "", ""] },
  { id: "5", data: ["gastone", "6", "", ""] },
  { id: "6", data: ["paperoga", "", "8 kg", ""] },
  { id: "7", data: ["archimede", "", "50 kg", ""] },
  { id: "8", data: ["eta beta", "2", "", ""] },
  { id: "9", data: ["zio paperone", "3", "", ""] },
];

export function GestioneMagazzino() {
  const [searchTerm, setSearchTerm] = useState("");

  const searchValue = searchTerm.trim().toLowerCase();

  const filteredRows = staticRows.filter((row) =>
    row.data[0].toLowerCase().includes(searchValue)
  );

  const sortedRows = [...filteredRows].sort((a, b) =>
    a.data[0].localeCompare(b.data[0], "it", { sensitivity: "base" })
  );

  return (
    <RicercaTabella
      title="Giacenze Magazzino"
      columns={columns}
      rows={sortedRows}
      onSearchChange={setSearchTerm}
      searchLabel="Cerca prodotto"
      searchPlaceholder="prodotto"
      showNewButton={false}
    />
  );
}
