import { fetchUserToChange, getInitialUsers, searchUsersByName } from "../api/mock-backend"
import { useState, useEffect } from "react";

import { RicercaTabella } from "./RicercaTabella"
import { user } from "../types/piuzuppa";
import { ModificaUtente } from "./ModificaUtente";


export function GestioneUtenti() {
  const [editingUser, setEditingUser] = useState<user | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [filteredRows, setFilteredRows] = useState<{ id: string; data: string[] }[]>([]);
  const columns = [
    "Nome",
    "Cognome",
    "Username",
    "email",
    "telefono",
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
          u.nome,
          u.cognome,
          u.username,
          u.email,
          u.telefono, 
          u.livelloAccesso,
          u.puntiDistribuzione.join(", "),
          u.ruoli.join(", ")
        ]
      }));
      
      setFilteredRows(tableData);
    };

    fetchFiltered();
  }, [searchTerm, refreshKey]);

  const handleEdit = async (id: string) => {
    console.log("Editing user with ID:", id);
    const user = await fetchUserToChange(id);
    if (user) setEditingUser(user);
  };

  const handleSave = () => {
    setEditingUser(null);
    setRefreshKey((currentValue) => currentValue + 1);
  };

  if (editingUser) {
    return <ModificaUtente {...editingUser} onSave={handleSave} />;
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
