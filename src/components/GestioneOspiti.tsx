import { useEffect, useState } from "react";
import { RicercaTabella } from "./RicercaTabella";
import { useNavigate } from "react-router";
import { getGuests } from "../api/backend";
import type { GuestSummary } from "../types/piuzuppa";

const columns = [
  "Nome",
  "Cognome",
  "Data di nascita",
  "Telefono",
  "N. familiari",
  "Numero Pasti",
  "Residente",
];

export function GestioneOspiti() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [guests, setGuests] = useState<GuestSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchValue = searchTerm.trim().toLowerCase();

  useEffect(() => {
    const loadGuests = async () => {
      const loadedGuests = await getGuests();
      setGuests(loadedGuests);
      setIsLoading(false);
    };

    void loadGuests();
  }, []);

  const filteredGuests = guests.filter((guest) =>
    `${guest.nome} ${guest.cognome}`
      .toLowerCase()
      .includes(searchValue)
  );

  const sortedRows = [...filteredGuests]
    .sort((a, b) =>
      `${a.nome} ${a.cognome}`.localeCompare(
        `${b.nome} ${b.cognome}`,
        "it",
        { sensitivity: "base" }
      )
    )
    .map((guest) => ({
      id: guest.id,
      data: [
        guest.nome,
        guest.cognome,
        guest.dataNascita,
        guest.telefono,
        String(guest.numeroFamiliari),
        String(guest.numeroPasti),
        guest.residente ? "Si" : "No",
      ],
    }));

  const tableRows = isLoading
    ? [
        {
          id: "loading",
          data: ["Caricamento...", "", "", "", "", "", ""],
        },
      ]
    : sortedRows;

  const handleRowClick = (id: string) => {
    navigate(`/visualizza-ospite/${id}`);
  };

  return (
    <RicercaTabella
      title="Gestione Ospiti"
      columns={columns}
      rows={tableRows}
      onSearchChange={setSearchTerm}
      searchLabel="Cerca ospite"
      searchPlaceholder="nome o cognome"
      showNewButton={true}
      newButtonLabel="Nuovo ospite"
      newButtonPath="/nuovo-ospite"
      onRowClick={isLoading ? undefined : handleRowClick}
    />
  );
}
