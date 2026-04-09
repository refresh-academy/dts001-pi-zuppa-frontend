import { fetchUserToChange, getInitialUsers } from "../api/backend"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { RicercaTabella } from "./RicercaTabella"
import { User } from "../types/piuzuppa";
import { ModificaUtente } from "./ModificaUtente";


export function GestioneUtenti() {
  const navigate = useNavigate();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
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
    const loadUsers = async () => {
      const data = await getInitialUsers();
      setUsers(data);
    };

    loadUsers();
  }, [refreshKey]);

  const searchValue = searchTerm.trim().toLowerCase();

  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(searchValue) ||
    user.cognome.toLowerCase().includes(searchValue)
  );

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    `${a.nome} ${a.cognome}`.localeCompare(
      `${b.nome} ${b.cognome}`,
      "it",
      { sensitivity: "base" }
    )
  );

  const rows = sortedUsers.map((user) => ({
    id: user.id,
    data: [
      user.nome,
      user.cognome,
      user.username,
      user.email,
      user.telefono,
      user.livelloAccesso,
      user.puntiDistribuzione.join(", "),
      user.ruoli.join(", "),
    ],
  }));

  const handleEdit = async (id: string) => {
    console.log("Editing user with ID:", id);
    const user = await fetchUserToChange(id);
    if (user) setEditingUser(user);
  };

  const handleSave = () => {
    setEditingUser(null);
    setRefreshKey((currentValue) => currentValue + 1);
  };

  const handleRowClick = (id: string) => {
    navigate(`/visualizza-utente/${id}`);
  };

  if (editingUser) {
    return <ModificaUtente {...editingUser} onSave={handleSave} />;
  }

  return (
    <RicercaTabella
      title="Gestione Utenti"
      columns={columns}
      rows={rows}
      onSearchChange={(val) => setSearchTerm(val)}
      searchLabel="Cerca utente"
      searchPlaceholder="nome o cognome"
      onEdit={handleEdit}
      onRowClick={handleRowClick}
    />
  )
}
