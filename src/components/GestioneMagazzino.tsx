
import { RicercaTabella } from "./RicercaTabella"

export function GestioneMagazzino() {
  const columns = [
    "Nome prodotto",
    "Unita",
    "Peso",
    "Scadenza"
    
  ]

  const rows = [
    ["Pomodoro", "-", "30kg", "30/05/2026" ],
    ["Biscotti", "50pezzi", "25kg", "27/03/2031"],
  ]

  return <RicercaTabella title="Cerca prodotto" columns={columns} rows={rows} />
}
