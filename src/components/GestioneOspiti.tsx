import { useState } from "react";
import { RicercaTabella } from "./RicercaTabella";
import { useNavigate } from "react-router";

const columns = [
  "Nome",
  "Cognome",
  "Data di nascita",
  "Telefono",
  "Ente",
  "Ricevimento pasto",
  "Residente",
];

const staticRows = [
  {
    id: "1",
    data: ["Mario", "Rossi", "26/04/1985", "333 1234567", "Caritas", "Mensa", "No"],
  },
  {
    id: "2",
    data: ["Anna", "Bianchi", "15/06/1973", "348 7654321", "Comune", "Asporto", "Si"],
  },
];

export function GestioneOspiti() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const searchValue = searchTerm.trim().toLowerCase();

  const filteredRows = staticRows.filter((row) =>
    `${row.data[0]} ${row.data[1]}`
      .toLowerCase()
      .includes(searchValue)
  );

  const sortedRows = [...filteredRows].sort((a, b) =>
    `${a.data[0]} ${a.data[1]}`.localeCompare(
      `${b.data[0]} ${b.data[1]}`,
      "it",
      { sensitivity: "base" }
    )
  );

  const handleRowClick = (id: string) => {
    navigate(`/visualizza-ospite/${id}`);
  };

  return (
    <RicercaTabella
      title="Gestione Ospiti"
      columns={columns}
      rows={sortedRows}
      onSearchChange={setSearchTerm}
      searchLabel="Cerca ospite"
      searchPlaceholder="nome o cognome"
      showNewButton={true}
      newButtonLabel="Nuovo ospite"
      newButtonPath="/nuovo-ospite"
      onRowClick={handleRowClick}
    />
  );
}
