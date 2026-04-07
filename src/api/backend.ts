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
  site: PuntoDiDistribuzione[]
  role: Ruolo[]
}

function toArray<T>(value: T[] | T | null | undefined): T[] {
  if (Array.isArray(value)) return value
  if (value == null) return []
  return [value]
}

function normalizeUser(raw: any): User {
  const puntiDistribuzione = toArray(
    raw?.puntiDistribuzione ?? raw?.site
  ) as PuntoDiDistribuzione[]

  const ruoli = toArray(raw?.ruoli ?? raw?.role) as Ruolo[]

  return {
    id: String(raw?.id ?? raw?._id ?? ""),
    nome: String(raw?.nome ?? raw?.name ?? ""),
    cognome: String(raw?.cognome ?? raw?.surname ?? ""),
    username: String(raw?.username ?? ""),
    password: String(raw?.password ?? ""),
    telefono: String(raw?.telefono ?? raw?.phone ?? ""),
    email: String(raw?.email ?? ""),
    livelloAccesso: (raw?.livelloAccesso ?? raw?.accessLevel ?? "volontario") as User["livelloAccesso"],
    puntiDistribuzione,
    ruoli,
  }
}

function extractUsers(usersLoad: any): any[] {
  if (Array.isArray(usersLoad)) return usersLoad
  if (Array.isArray(usersLoad?.users)) return usersLoad.users
  if (Array.isArray(usersLoad?.data?.users)) return usersLoad.data.users
  if (Array.isArray(usersLoad?.data)) return usersLoad.data
  return []
}

export async function createUser(utente: CreateUserProps): Promise<User> {
  const res = await api.post("/users", utente)
  const userLoad = res.data?.user ?? res.data?.data?.user ?? res.data
  return normalizeUser(userLoad)
}

export async function modifyUser(utente: CreateUserProps, id: string): Promise<User> {
  const res = await api.patch(`/users/${id}`, utente)
  const userLoad = res.data?.user ?? res.data?.data?.user ?? res.data
  return normalizeUser(userLoad)
}

export async function getUsers(): Promise<User[]> {
  const res = await api.get("/users")
  return extractUsers(res.data).map(normalizeUser)
}

export async function searchUsersByName(name: string): Promise<User[]> {
  const users = await getUsers();
  if (!name) return users;
  const lowerName = name.toLowerCase();
  return users.filter(u => 
    u.nome.toLowerCase().includes(lowerName) || 
    u.cognome.toLowerCase().includes(lowerName)
  );
}

export async function fetchUserToChange(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.id === id) ?? null;
}

export const getInitialUsers = getUsers;