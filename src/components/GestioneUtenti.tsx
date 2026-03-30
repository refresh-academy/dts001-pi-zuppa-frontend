
import { fetchUserToChange, getInitialUsers, searchUsersByName } from "../api/mock-backend"
import { useState, useEffect } from "react";

import { RicercaTabella } from "./RicercaTabella"
import { useNavigate } from "react-router";
import { user } from "../types/piuzuppa";
import { ModificaUtente } from "./ModificaUtente";


export function GestioneUtenti() {
  const [editingUser, setEditingUser] = useState<user | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<{ id: string; data: string[] }[]>([]);
  const columns = [
    "Nome e Cognome",
    "Username",
    "Livello di accesso",
    "Punti di distribuzione",
    "Ruoli",
  ]

  useEffect(() => {
    const fetchFiltered = async () => {
      const users = await searchUsersByName(searchTerm);
      const tableData = users.map(u => ({
        id: u.id,
        data: [
          u.nomeECognome, 
          u.username, 
          u.livelloAccesso,
          u.puntiDistribuzione.join(", "),
          u.ruoli.join(", ")
        ]
      }));
      
      setFilteredRows(tableData);
    };

    fetchFiltered();
  }, [searchTerm]);

  const handleEdit = async (id: string) => {
    console.log("Editing user with ID:", id);
    const user = await fetchUserToChange(id);
    if (user) setEditingUser(user);
  };

  if (editingUser) {
    return <ModificaUtente {...editingUser} />;
  }

  return (
    <RicercaTabella
      title="Gestione Utenti"
      columns={columns}
      rows={filteredRows}
      onSearchChange={(val) => setSearchTerm(val)}
      onEdit={handleEdit}
    />
  )
}