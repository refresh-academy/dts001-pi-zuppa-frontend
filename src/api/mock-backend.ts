import type {
  PuntoDiDistribuzione,
  Ruolo,
  user,
} from "../types/piuzuppa"

const STORAGE_KEY = "piuzuppa_users";

 export const getInitialUsers = (): user[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [
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
}

let activeUsers: user[] = getInitialUsers();
const syncToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activeUsers));
};
type NewUserInput = {
  nomeECognome: user["nomeECognome"]
  username: user["username"]
  password: user["password"]
  livelloAccesso: user["livelloAccesso"]
  puntiDistribuzione: PuntoDiDistribuzione[]
  ruoli: Ruolo[]
}

export function addNewUser({
  nomeECognome,
  username,
  password,
  livelloAccesso,
  puntiDistribuzione,
  ruoli,
}: NewUserInput) {
  const newUser: user = {
    nomeECognome,
    username,
    password,
    livelloAccesso,
    puntiDistribuzione,
    ruoli,
  }
  activeUsers.push(newUser);
  syncToStorage()
  console.log(activeUsers);
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
    activeUsers.find((u) => u.username === username) ?? null;

  if (!userWithUsername) return { status: "username-error" };
  if (userWithUsername.password !== password) return { status: "password-error" };

  return { status: "success", user: userWithUsername };
}
