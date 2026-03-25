export type user = {
nome:string,
cognome:string,
username:string,
password:string,
livelloAccesso: "volontario" | "coordinatore",
puntoDistribuzione:"saffi" | "battiferro" | "sandonato" | "savena",
ruolo: "cucina" | "magazzino" | "accoglienza"
}