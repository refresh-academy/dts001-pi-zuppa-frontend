import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { RicercaTabella } from "./RicercaTabella";
import type { Ente } from "../types/piuzuppa";
import { getEnti } from "../api/backend";

const columns = ["Nome", "email", "telefono", "indirizzo"];

export function GestioneEnti() {
  const navigate = useNavigate()
  const [enti, setEnti] = useState<Ente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");
  const searchValue = searchTerm.trim().toLowerCase();

  useEffect(() => {
    const loadEnti = async () => {
      const loadedEnti = await getEnti()
      setEnti(loadedEnti)
      setIsLoading(false)
    }

    void loadEnti()
  }, [])

  const filteredEnti = enti.filter((ente) =>
    `${ente.nome} ${ente.email} ${ente.telefono} ${ente.indirizzo}`
      .toLowerCase()
      .includes(searchValue)
  );

  const rows = filteredEnti.map((ente) => ({
    id: ente.id,
    data: [ente.nome, ente.email, ente.telefono, ente.indirizzo],
  }));

  const tableRows = isLoading
    ? [
        {
          id: "loading",
          data: ["Caricamento...", "", "", ""],
        },
      ]
    : rows

  const handleRowClick = (id: string) => {
    if (id === "loading") return
    navigate(`/visualizza-ente/${id}`)
  }

  return (
    <RicercaTabella
      title="Gestione Enti"
      columns={columns}
      rows={tableRows}
      onSearchChange={setSearchTerm}
      searchLabel="Cerca ente"
      searchPlaceholder="nome, email, telefono o indirizzo"
      showNewButton={true}
      newButtonLabel="Nuovo"
      newButtonPath="/nuovo-ente"
      onRowClick={isLoading ? undefined : handleRowClick}
    />
  );
}
