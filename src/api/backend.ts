import axios from "axios"
import type {
  PuntoDiDistribuzione,
  Ruolo,
  User,
  Ente,
  Meal,
  GuestSummary,
  GuestDetail,
  GuestMealDetail,
} from "../types/piuzuppa"

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

type CreateGuestMeal = {
  mealType: string
  deliveryType: "mensa" | "asporto"
}

type CreateGuestProps = {
  name: string
  surname: string
  resident: boolean
  birthDate: string
  familyCount: number
  profession: string
  phone: string
  entityName: string
  siteName: string
  meals: CreateGuestMeal[]
}

type UpdateGuestProps = {
  name: string
  surname: string
  resident: boolean
  birthDate: string
  familyCount: number
  profession: string
  phone: string
  entityName: string
  meals: CreateGuestMeal[]
}

type CreateEnteProps = {
  nome: string
  email: string
  telefono: string
  indirizzo: string
}

export type GuestMealRecord = {
  guestId: string
  mealType: string
  deliveryType: "mensa" | "asporto"
}

export type RecipeRequirement = {
  recipeName: string
  recipeDescription: string
  productName: string
  quantityPerMeal: number
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

function formatItalianDate(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleDateString("it-IT")
}

function normalizeGuestSummary(raw: any): GuestSummary {
  const guestMeals = cleanPgArray(raw?.guest_meal)

  return {
    id: String(raw?.id ?? ""),
    nome: String(raw?.nome ?? ""),
    cognome: String(raw?.cognome ?? ""),
    dataNascita: formatItalianDate(raw?.data_nascita),
    telefono: String(raw?.telefono ?? ""),
    numeroFamiliari: Number(raw?.numeri_famigliari ?? 0),
    residente: Boolean(raw?.residente),
    numeroPasti: guestMeals.length,
  }
}

function normalizeGuestDetail(raw: any): GuestDetail {
  const mealsRaw = Array.isArray(raw?.meals) ? raw.meals : []
  const pasti: GuestMealDetail[] = mealsRaw.map((meal: any, index: number) => ({
    id: Number(meal?.id ?? index + 1),
    mealType: String(meal?.meal_type ?? meal?.mealType ?? ""),
    deliveryType: String(
      meal?.delivery_type ?? meal?.deliveryType ?? "",
    ) as GuestMealDetail["deliveryType"],
  }))

  return {
    id: String(raw?.id ?? ""),
    nome: String(raw?.nome ?? ""),
    cognome: String(raw?.cognome ?? ""),
    residente: Boolean(raw?.residente),
    dataNascita:
      typeof raw?.data_nascita === "string"
        ? raw.data_nascita.slice(0, 10)
        : "",
    numeroFamiliari: Number(raw?.numeri_famigliari ?? 0),
    professione: String(raw?.professione ?? ""),
    telefono: String(raw?.telefono ?? ""),
    enteSegnalazione: String(raw?.entity_name ?? ""),
    pasti,
  }
}

function normalizeEnte(raw: any): Ente {
  return {
    id: String(raw?.id ?? ""),
    nome: String(raw?.nome ?? raw?.name ?? ""),
    email: String(raw?.email ?? raw?.mail ?? ""),
    telefono: String(raw?.telefono ?? raw?.phone ?? ""),
    indirizzo: String(raw?.indirizzo ?? raw?.via ?? raw?.address ?? ""),
  }
}

function extractUsers(usersLoad: any): any[] {
  if (Array.isArray(usersLoad)) return usersLoad
  if (Array.isArray(usersLoad?.users)) return usersLoad.users
  if (Array.isArray(usersLoad?.data?.users)) return usersLoad.data.users
  if (Array.isArray(usersLoad?.data)) return usersLoad.data
  return []
}

function extractEntities(entitiesLoad: any): any[] {
  if (Array.isArray(entitiesLoad)) return entitiesLoad
  if (Array.isArray(entitiesLoad?.entities)) return entitiesLoad.entities
  if (Array.isArray(entitiesLoad?.data?.entities)) return entitiesLoad.data.entities
  if (Array.isArray(entitiesLoad?.data)) return entitiesLoad.data
  return []
}

function extractMealTypes(mealTypesLoad: any): any[] {
  if (Array.isArray(mealTypesLoad)) return mealTypesLoad
  if (Array.isArray(mealTypesLoad?.meal_types)) return mealTypesLoad.meal_types
  if (Array.isArray(mealTypesLoad?.mealTypes)) return mealTypesLoad.mealTypes
  if (Array.isArray(mealTypesLoad?.data?.meal_types)) return mealTypesLoad.data.meal_types
  if (Array.isArray(mealTypesLoad?.data?.mealTypes)) return mealTypesLoad.data.mealTypes
  if (Array.isArray(mealTypesLoad?.data)) return mealTypesLoad.data
  return []
}

function extractGuestMeals(guestMealsLoad: any): any[] {
  if (Array.isArray(guestMealsLoad)) return guestMealsLoad
  if (Array.isArray(guestMealsLoad?.guest_meal)) return guestMealsLoad.guest_meal
  if (Array.isArray(guestMealsLoad?.guestMeals)) return guestMealsLoad.guestMeals
  if (Array.isArray(guestMealsLoad?.data?.guest_meal)) return guestMealsLoad.data.guest_meal
  if (Array.isArray(guestMealsLoad?.data?.guestMeals)) return guestMealsLoad.data.guestMeals
  if (Array.isArray(guestMealsLoad?.data)) return guestMealsLoad.data
  return []
}

function normalizeGuestMealRow(raw: any): GuestMealRecord | null {
  const mealType = String(
    raw?.meal_type ?? raw?.mealType ?? raw?.tipo ?? "",
  ).trim()
  const deliveryTypeRaw = String(
    raw?.ricevimento_pasto ?? raw?.delivery_type ?? raw?.deliveryType ?? raw?.consegna ?? "",
  )
    .trim()
    .toLowerCase()
  const guestId = String(raw?.guest_id ?? raw?.guestId ?? raw?.id ?? "")

  if (!mealType) return null
  if (deliveryTypeRaw !== "mensa" && deliveryTypeRaw !== "asporto") return null

  return {
    guestId,
    mealType,
    deliveryType: deliveryTypeRaw,
  }
}

function normalizeRecipeRequirementRow(raw: any): RecipeRequirement | null {
  const recipeName = String(raw?.recipe_name ?? raw?.recipeName ?? "").trim()
  const productName = String(raw?.product_name ?? raw?.productName ?? "").trim()
  const recipeDescription = String(
    raw?.recipe_description ?? raw?.recipeDescription ?? "",
  ).trim()
  const quantityRaw = Number(raw?.quantity_per_meal ?? raw?.quantityPerMeal ?? NaN)

  if (!recipeName || !productName || !Number.isFinite(quantityRaw)) return null

  return {
    recipeName,
    recipeDescription,
    productName,
    quantityPerMeal: quantityRaw,
  }
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

export async function createGuest(guest: CreateGuestProps): Promise<{ status: "success" } | { error: string }> {
  try {
    await api.post("/guests", guest)
    return { status: "success" }
  } catch {
    return { error: "Errore durante la creazione dell'ospite." }
  }
}

export async function modifyGuest(guest: UpdateGuestProps, id: string): Promise<GuestDetail | { error: string }> {
  try {
    const res = await api.patch(`/guests/${id}`, guest)
    const guestLoad = res.data?.guest ?? res.data?.data?.guest ?? res.data

    if (guestLoad && typeof guestLoad === "object") {
      return normalizeGuestDetail(guestLoad)
    }

    const refreshedGuest = await fetchGuestToChange(id)
    if (refreshedGuest) return refreshedGuest
    return { error: "Errore durante il salvataggio dell'ospite." }
  } catch {
    return { error: "Errore durante il salvataggio dell'ospite." }
  }
}

export type DeleteGuestResult =
  | { status: "success" }
  | { status: "not-found" }
  | { status: "error"; message: string }

export async function deleteGuest(id: string): Promise<DeleteGuestResult> {
  try {
    await api.delete(`/guests/${id}`)
    return { status: "success" }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return { status: "not-found" }
    }

    return {
      status: "error",
      message: "Errore durante l'eliminazione dell'ospite.",
    }
  }
}

export async function createEnte(ente: CreateEnteProps): Promise<Ente | { error: string }> {
  try {
    const res = await api.post("/entities", {
      name: ente.nome,
      email: ente.email,
      phone: ente.telefono,
      address: ente.indirizzo,
    })
    const entityLoad = res.data?.entity ?? res.data?.data?.entity ?? res.data
    return normalizeEnte(entityLoad)
  } catch {
    return { error: "Errore durante la creazione dell'ente." }
  }
}

export async function modifyEnte(ente: CreateEnteProps, id: string): Promise<Ente | { error: string }> {
  try {
    const res = await api.patch(`/entities/${id}`, {
      name: ente.nome,
      email: ente.email,
      phone: ente.telefono,
      address: ente.indirizzo,
    })
    const entityLoad = res.data?.entity ?? res.data?.data?.entity ?? res.data

    if (entityLoad && typeof entityLoad === "object") {
      return normalizeEnte(entityLoad)
    }

    const refreshedEntity = await fetchEnteToChange(id)
    if (refreshedEntity) return refreshedEntity
    return { error: "Errore durante il salvataggio dell'ente." }
  } catch {
    return { error: "Errore durante il salvataggio dell'ente." }
  }
}

export type DeleteEnteResult =
  | { status: "success" }
  | { status: "not-found" }
  | { status: "error"; message: string }

export async function deleteEnte(id: string): Promise<DeleteEnteResult> {
  try {
    await api.delete(`/entities/${id}`)
    return { status: "success" }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return { status: "not-found" }
    }

    return {
      status: "error",
      message: "Errore durante l'eliminazione dell'ente.",
    }
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

export async function getGuests(): Promise<GuestSummary[]> {
  const res = await api.get("/guests")
  const guests = Array.isArray(res.data) ? res.data : []
  return guests.map(normalizeGuestSummary)
}

export async function getEnti(): Promise<Ente[]> {
  const res = await api.get("/entities")
  return extractEntities(res.data).map(normalizeEnte)
}

export async function fetchGuestToChange(id: string): Promise<GuestDetail | null> {
  try {
    const res = await api.get(`/guests/${id}`)
    return normalizeGuestDetail(res.data)
  } catch {
    return null
  }
}

export async function fetchEnteToChange(id: string): Promise<Ente | null> {
  try {
    const res = await api.get(`/entities/${id}`)
    const entityLoad = res.data?.entity ?? res.data?.data?.entity ?? res.data
    return normalizeEnte(entityLoad)
  } catch {
    return null
  }
}

export async function getEntityNames(): Promise<string[]> {
  const entities = await getEnti()
  return entities.map((entity) => entity.nome)
}

export async function getSiteNames(): Promise<string[]> {
  const res = await api.get("/sites")
  const sites = Array.isArray(res.data) ? res.data : []
  return sites
    .map((site) => String(site?.nome ?? "").trim())
    .filter((siteName) => siteName !== "")
}

export async function getMealTypes(): Promise<string[]> {
  const res = await api.get("/meal_types")
  const mealTypes = extractMealTypes(res.data)

  return Array.from(
    new Set(
      mealTypes
        .map((mealType: Meal | string) =>
          String(
            typeof mealType === "string"
              ? mealType
              : mealType?.tipo ?? "",
          ).trim(),
        )
        .filter((mealType) => mealType !== ""),
    ),
  )
}

export async function getGuestMealRecords(): Promise<GuestMealRecord[]> {
  try {
    const res = await api.get("/guest_meal")
    const directRows = extractGuestMeals(res.data)
      .map(normalizeGuestMealRow)
      .filter((row): row is GuestMealRecord => row !== null)

    if (directRows.length > 0) {
      return directRows
    }
  } catch {
    // fallback to guest detail endpoint when /guest_meal is not exposed by backend
  }

  const guests = await getGuests()
  const guestDetailsResult = await Promise.allSettled(
    guests.map((guest) => fetchGuestToChange(guest.id)),
  )

  const fallbackRows: GuestMealRecord[] = []

  guestDetailsResult.forEach((result) => {
    if (result.status !== "fulfilled" || !result.value) return
    const guest = result.value

    guest.pasti.forEach((meal) => {
      const mealType = String(meal.mealType ?? "").trim()
      const deliveryType = String(meal.deliveryType ?? "").trim().toLowerCase()

      if (!mealType) return
      if (deliveryType !== "mensa" && deliveryType !== "asporto") return

      fallbackRows.push({
        guestId: guest.id,
        mealType,
        deliveryType,
      })
    })
  })

  return fallbackRows
}

export async function getRecipeRequirements(): Promise<RecipeRequirement[]> {
  const res = await api.get("/recipes/requirements")

  const rows = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
      ? res.data.data
      : []

  return rows
    .map(normalizeRecipeRequirementRow)
    .filter((row): row is RecipeRequirement => row !== null)
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
