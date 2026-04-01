import type {
  PuntoDiDistribuzione,
  Ruolo,
  user,
} from "../types/piuzuppa"

const STORAGE_KEY = "piuzuppa_users";

function delay() : Promise<void> {
    return new Promise(
        (resolve) => setTimeout(resolve, 100)
    )
}

export const getInitialUsers = (): user[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    {
      nome: "Irene",
      cognome: "Ruscelli",
      username: "irene.ruscelli",
      password: "1312Izzy<32024Lea",
      livelloAccesso: "volontario",
      puntiDistribuzione: ["Saffi"],
      ruoli: ["cucina"],
      id: "86054924-ee75-4cd8-8b48-2a6ab05f1272",
      telefono: "",
      email: ""
    },
    {
      nome: "Svetlana",
      username: "svetty",
      password: "panda",
      livelloAccesso: "coordinatore",
      puntiDistribuzione: ["Savena"],
      ruoli: ["cucina"],
      id: "879e2cb0-6c05-4d87-bddd-ca663148aaa4",
      cognome: " Vitu",
      telefono: "",
      email: ""
    },
    {
      nome: "Simone",
      username: "Paddington",
      password: "fabrizioèuncornuto",
      livelloAccesso: "volontario",
      puntiDistribuzione: ["San Donato"],
      ruoli: ["magazzino"],
      id: "8e640d53-6cd0-4bc9-9ee7-0576420db546",
      cognome: "Querzoli",
      telefono: "",
      email: ""
    },
    {
      nome: "Nicolas",
      username: "Niko.car",
      password: "overwatch",
      livelloAccesso: "coordinatore",
      puntiDistribuzione: ["Battiferro"],
      ruoli: ["magazzino"],
      id: "3c9ecea5-04e1-41cb-94cc-ad5e45eef900",
      cognome: "Carotenuto",
      telefono: "",
      email: ""
    }
  ]
}

let activeUsers: user[] = getInitialUsers();
const syncToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activeUsers));
};

type NewUserInput = {
  nome: user["nome"]
  cognome: user["cognome"]
  email: user["email"]
  telefono: user["telefono"]
  username: user["username"]
  password: user["password"]
  livelloAccesso: user["livelloAccesso"]
  puntiDistribuzione: PuntoDiDistribuzione[]
  ruoli: Ruolo[]
}

export async function addNewUser({
  nome,
  cognome,
  telefono,
  email,
  username,
  password,
  livelloAccesso,
  puntiDistribuzione,
  ruoli,
}: NewUserInput) {
  await delay();
  const newUser: user = {
    nome,
    cognome,
    telefono,
    email,
    username,
    password,
    livelloAccesso,
    puntiDistribuzione,
    ruoli,
    id: crypto.randomUUID().toString()
  }
  activeUsers.push(newUser);
  syncToStorage()
  console.log(activeUsers);
}

export async function searchUsersByName(searchTerm: string): Promise<user[]> {
  await delay();
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  if (!normalizedSearch) return activeUsers;

  return activeUsers.filter(u => 
    u.nome.toLowerCase().includes(normalizedSearch)
  );
}

export async function fetchUserToChange(targetId: string): Promise<user | undefined> {
  await delay();
  const userToChange= activeUsers.find(u => u.id === targetId);
  return userToChange

}

export async function changeUser(
  idUtente: string,
  nuovoNome: string,
  nuovoCognome: string,
  nuovoTelefono: string,
  nuovaEmail: string,
  nuovoUsername: string,
  nuovaPassword: string,
  nuovoLivelloAccesso: "volontario" | "coordinatore",
  nuoviPuntiDistribuzione: PuntoDiDistribuzione[],
  nuoviRuoli: Ruolo[]
): Promise<user | undefined> {
  await delay();
  activeUsers = activeUsers.map(u => u.id === idUtente ? {
    ...u, 
    nome: nuovoNome,
    cognome: nuovoCognome,
    telefono: nuovoTelefono,
    email: nuovaEmail,
    username: nuovoUsername,
    password: nuovaPassword,
    livelloAccesso: nuovoLivelloAccesso,
    puntiDistribuzione: nuoviPuntiDistribuzione,
    ruoli: nuoviRuoli,
  } : u);

  syncToStorage();
  const updatedUser = activeUsers.find((u) => u.id === idUtente);
  console.log("Updated activeUsers:", activeUsers);
  return updatedUser;
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
