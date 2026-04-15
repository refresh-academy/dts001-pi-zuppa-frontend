import axios from "axios"
import type { PuntoDiDistribuzione, Ruolo, User } from "../types/piuzuppa"

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
})

export type VerifyCredentialsResult =
  | { status: "success"; user: User }
  | { status: "username-error" }
  | { status: "password-error" }

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<VerifyCredentialsResult> {
  const users = await getUsers()
  const userWithUsername = users.find((u) => u.username === username) ?? null

  if (!userWithUsername) return { status: "username-error" };
  if (userWithUsername.password !== password) return { status: "password-error" };

  return { status: "success", user: userWithUsername };
}


type CreateUserProps = {
  name: string
  surname: string
  phone: string
  username: string
  password: string
  email: string
  accessLevel: User["livelloAccesso"]
  abilitation: boolean
  site: PuntoDiDistribuzione[]
  role: Ruolo[]
}

function toArray<T>(value: T[] | T | null | undefined): T[] {
  if (Array.isArray(value)) return value
  if (value == null) return []
  return [value]
}

function cleanPgArray(value: any): string[] {
  if (typeof value !== "string") return toArray(value);
  const cleaned = value.replace(/[{}"\\]/g, "").trim();
  return cleaned === "" ? [] : cleaned.split(",").map(s => s.trim());
}

function normalizeUser(raw: any): User {
  const puntiDistribuzione = (Array.isArray(raw?.sites) ? raw.sites : []) as PuntoDiDistribuzione[];
  const ruoli = (Array.isArray(raw?.roles) ? raw.roles : []) as Ruolo[];

  return {
    id: String(raw?.id ?? ""),
    nome: String(raw?.nome ?? ""),
    cognome: String(raw?.cognome ?? ""),
    username: String(raw?.username ?? ""),
    password: String(raw?.password ?? ""),
    telefono: String(raw?.telefono ?? ""),
    email: String(raw?.email ?? ""),
    livelloAccesso: (raw?.livello_accesso ?? raw?.livelloAccesso ?? "volontario") as User["livelloAccesso"],
    abilitazione: Boolean(raw?.abilitazione ?? true),
    puntiDistribuzione,
    ruoli,
  };
}

function extractUsers(usersLoad: any): any[] {
  if (Array.isArray(usersLoad)) return usersLoad
  if (Array.isArray(usersLoad?.users)) return usersLoad.users
  if (Array.isArray(usersLoad?.data?.users)) return usersLoad.data.users
  if (Array.isArray(usersLoad?.data)) return usersLoad.data
  return []
}

export async function createUser(utente: CreateUserProps): Promise<User | { error: string }> {
  const users = await getUsers();

  const isDuplicate = users.some(
    (u) => u.username.toLowerCase() === utente.username.toLowerCase()
  );

  if (isDuplicate) {
    return { error: "Nome utente già esistente." };
  }

  try {
    const res = await api.post("/users", utente);
    const userLoad = res.data?.user ?? res.data?.data?.user ?? res.data;
    return normalizeUser(userLoad);
  } catch (err) {
    return { error: "Errore durante la creazione dell'utente." };
  }
}

export async function modifyUser(utente: CreateUserProps, id: string): Promise<User> {
  const res = await api.patch(`/users/${id}`, utente)
  const userLoad = res.data?.user ?? res.data?.data?.user ?? res.data
  return normalizeUser(userLoad)
}

export type DeleteUserResult =
  | { status: "success" }
  | { status: "not-found" }
  | { status: "error"; message: string }

export async function deleteUser(id: string): Promise<DeleteUserResult> {
  try {
    await api.delete(`/users/${id}`)
    return { status: "success" }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return { status: "not-found" }
    }

    return {
      status: "error",
      message: "Errore durante l'eliminazione dell'utente.",
    }
  }
}

export async function getUsers(): Promise<User[]> {
  const res = await api.get("/users")
  return extractUsers(res.data).map(normalizeUser)
}

export async function searchUsersByName(name: string): Promise<User[]> {
  const users = await getUsers();
  const sortedUsers = [...users].sort((a, b) =>
    a.nome.toLowerCase().localeCompare(b.nome.toLowerCase())
  );

  if (!name) return sortedUsers;
  const lowerName = name.toLowerCase();
  return sortedUsers.filter(u =>
    u.nome.toLowerCase().includes(lowerName) ||
    u.cognome.toLowerCase().includes(lowerName)
  );
}

export async function fetchUserToChange(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.id === id) ?? null;
}

export const getInitialUsers = getUsers;
