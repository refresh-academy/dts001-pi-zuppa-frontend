import type { user } from "../types/piuzuppa"

const mockUsers: user[] = [
  {
    nome: "Irene",
    cognome: "Ruscelli",
    username: "irene.ruscelli",
    password: "1312Izzy<32024Lea",
    livelloAccesso: "volontario",
    puntoDistribuzione: "saffi",
    ruolo: "cucina",
  },
  {
      nome: "Svetlana",
      cognome: "Vitu",
      username: "svetty",
      password: "panda",
      livelloAccesso: "coordinatore",
      puntoDistribuzione: "savena",
      ruolo: "cucina"
  },
  {
      nome: "Simone",
      cognome: "Querzoli",
      username: "Paddington",
      password: "fabrizioèuncornuto",
      livelloAccesso: "volontario",
      puntoDistribuzione: "sandonato",
      ruolo: "magazzino"
  },
  {
      nome: "Nicolas",
      cognome: "Carotenuto",
      username: "Niko.car",
      password: "overwatch",
      livelloAccesso: "coordinatore",
      puntoDistribuzione: "battiferro",
      ruolo: "magazzino"
  }
]

export type VerifyCredentialsResult =
  | { status: "success"; user: user }
  | { status: "username-error" }
  | { status: "password-error" }

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<VerifyCredentialsResult> {
  const userWithUsername =
    mockUsers.find((mockUser) => mockUser.username === username) ?? null

  if (!userWithUsername) {
    return { status: "username-error" }
  }

  if (userWithUsername.password !== password) {
    return { status: "password-error" }
  }

  return { status: "success", user: userWithUsername }
}
