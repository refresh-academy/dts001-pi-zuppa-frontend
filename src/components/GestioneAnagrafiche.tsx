
import { RicercaTabella } from "./RicercaTabella"

export function GestioneOspiti() {
  const columns = [
    "Nome",
    "Cognome",
    "Data di nascita",
    "Telefono",
    "Ente",
    "Ricevimento pasto",
    "Residente",
  ]

  const rows = [
    ["Mario", "Rossi", "26/04/1985", "333 1234567", "Caritas", "Mensa", "No"],
    ["Anna", "Bianchi", "15/06/1973", "348 7654321", "Comune", "Asporto", "Si"],
  ]

  return <RicercaTabella title="Gestione Ospiti" columns={columns} rows={rows} />
}
