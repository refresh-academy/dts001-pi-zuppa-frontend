import { useState } from "react";
import { useNavigate } from "react-router";
import { RicercaTabella } from "./RicercaTabella";
import type { Ente } from "../types/piuzuppa";

const columns = ["Nome", "email", "telefono", "indirizzo"];

const enti: Ente[] = [
  {
    id: "1",
    nome: "Caritas",
    email: "caritas@email.it",
    telefono: "051 5815663",
    indirizzo: "Via Avesella 15",
  },
  {
    id: "2",
    nome: "CSM",
    email: "mazzacorati@email.it",
    telefono: "051783456",
    indirizzo: "Via Toscana 18",
  },
  {
    id: "3",
    nome: "Comune di Bologna",
    email: "comunebologna@email.it",
    telefono: "051891273",
    indirizzo: "Piazza Maggiore 1",
  },
];

export function GestioneEnti() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
  const searchValue = searchTerm.trim().toLowerCase();

  const filteredEnti = enti.filter((ente) =>
    `${ente.nome} ${ente.email} ${ente.telefono} ${ente.indirizzo}`
      .toLowerCase()
      .includes(searchValue)
  );

  const rows = filteredEnti.map((ente) => ({
    id: ente.id,
    data: [ente.nome, ente.email, ente.telefono, ente.indirizzo],
  }));

  const handleRowClick = (id: string) => {
    navigate(`/visualizza-ente/${id}`)
  }

  return (
    <RicercaTabella
      title="Gestione Enti"
      columns={columns}
      rows={rows}
      onSearchChange={setSearchTerm}
      searchLabel="Cerca utente"
      searchPlaceholder="nome, email, telefono o indirizzo"
      showNewButton={true}
      newButtonLabel="Nuovo"
      newButtonPath="/nuovo-ente"
      onRowClick={handleRowClick}
    />
  );
}
