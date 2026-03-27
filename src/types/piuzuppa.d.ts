export type user = {
nomeECognome:string,
username:string,
password:string,
livelloAccesso: "volontario" | "coordinatore",
puntiDistribuzione: PuntoDiDistribuzione[]
ruoli: Ruolo[]
}

type PuntoDiDistribuzione = "Saffi" | "Battiferro" | "San Donato" | "Savena"

type Ruolo = "cucina" | "magazzino" | "accoglienza"

export type ospite = {
    nome: string,
    cognome: string,
    residente: boolean,
    dataDiNascita: Date,
    numeroFamiliari: number,
    professione: string,
    telefono: number,
    enteSegnalazione: string,
    ricevimentoPasto: "mensa" | "asporto",
    pasti: Pasto[]
}
type Pasto = {
    id: number, 
    preferenzaAlimentare: "standard | vegetariano | vegano | halal"
}


export type SidebarOption =
    | "anagrafiche"
    | "magazzino"
    | "cucina"
    | "accoglienza"
    | "utenti"
    

export type SidebarConfig ={

  key: SidebarOption,
  label:string,
  path:string,
  subItems?: {
    label: string,
    path: string
  }[]
  
} 
  
 
