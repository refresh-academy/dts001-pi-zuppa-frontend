export type User = {
    id: string,
    nome: string,
    cognome: string,
    username: string,
    password: string,
    telefono: string,
    email: string,
    livelloAccesso: "volontario" | "coordinatore",
    abilitazione: boolean,
    puntiDistribuzione: PuntoDiDistribuzione[],
    ruoli: Ruolo[]
}

export type Entity = {
    id: string,
    nome: string,
    telefono: string,
    via: string
}

export type PuntoDiDistribuzione =
    | "Saffi"
    | "Battiferro"
    | "San Donato"
    | "Savena"

export type Ruolo = "cucina" | "magazzino" | "accoglienza"

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
    | "ospiti"
    | "magazzino"
    | "cucina"
    | "accoglienza"
    | "utenti"


export type SidebarConfig = {

    key: SidebarOption,
    label: string,
    path: string,
    subItems?: {
        label: string,
        path: string
    }[]

}

export type Meal = {
    tipo: string
}

export type GuestSummary = {
    id: string,
    nome: string,
    cognome: string,
    dataNascita: string,
    telefono: string,
    numeroFamiliari: number,
    residente: boolean,
    numeroPasti: number
}

