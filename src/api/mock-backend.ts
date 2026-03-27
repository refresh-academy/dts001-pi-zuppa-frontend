import type { PuntoDiDistribuzione, Ruolo, user } from "../types/piuzuppa"

const mockUsers: user[] = [
  {
    nomeECognome: "Irene Ruscelli",
    username: "irene.ruscelli",
    password: "1312Izzy<32024Lea",
    livelloAccesso: "volontario",
    puntiDistribuzione: ["Saffi"],
    ruoli: ["cucina"]
  },
  {
      nomeECognome: "Svetlana Vitu",
      username: "svetty",
      password: "panda",
      livelloAccesso: "coordinatore",
      puntiDistribuzione: ["Savena"],
      ruoli: ["cucina"]
  },
  {
      nomeECognome: "Simone Querzoli",
      username: "Paddington",
      password: "fabrizioèuncornuto",
      livelloAccesso: "volontario",
      puntiDistribuzione: ["San Donato"],
      ruoli: ["magazzino"]
  },
  {
      nomeECognome: "Nicolas Carotenuto",
      username: "Niko.car",
      password: "overwatch",
      livelloAccesso: "coordinatore",
      puntiDistribuzione: ["Battiferro"],
      ruoli: ["magazzino"]
  }
]
export function addNewUser (
  newNomeECognome: string, 
  newUsername: string, 
  newPassword: string, 
  newLivelloAccesso: string, 
  newPuntiDistribuzione: PuntoDiDistribuzione[], 
  newRuoli: Ruolo[]) {
  
  const newUser: user = {
    nomeECognome: newNomeECognome,
    username: newUsername,
    password: newPassword,
    livelloAccesso: newLivelloAccesso as any,
    puntiDistribuzione: newPuntiDistribuzione,
    ruoli: newRuoli
  };

  mockUsers.push(newUser); 
}


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
