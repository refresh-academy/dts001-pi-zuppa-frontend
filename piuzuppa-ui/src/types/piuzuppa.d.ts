export type user = {
nome:string,
cognome:string,
username:string,
password:string,
livelloAccesso: "volontario" | "coordinatore",
puntoDistribuzione:"saffi" | "battiferro" | "sandonato" | "savena",
ruolo: "cucina" | "magazzino" | "accoglienza"
}

export type ospite = {
    nome: string,
    cognome: string,
    residente: boolean,
    dataDiNascita: Date,
    numeroFamiliari: number,
    professione: string,
    telefono: number,
    enteSegnalazione: string,
    
}