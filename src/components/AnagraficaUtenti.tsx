
import { getInitialUsers } from "../api/mock-backend"
import { RicercaTabella } from "./RicercaTabella"

export function AnagraficaUtenti() {
  const users = getInitialUsers()

  const columns = [
    "Nome e Cognome",
    "Username",
    "Livello di accesso",
    "Punti di distribuzione",
    "Ruoli",
  ]

  const rows = users.map((user) => [
    user.nomeECognome,
    user.username,
    user.livelloAccesso,
    user.puntiDistribuzione.join(", "),
    user.ruoli.join(", "),
  ])

  return (
    <RicercaTabella
      title="Cerca utente"
      columns={columns}
      rows={rows}
    />
  )
}
