import { Login } from "./components/Login"
import "./App.css"
import { Sidebar } from "./components/Sidebar"
import { Navigate, Route, Routes } from "react-router"
import type { SidebarConfig } from "./types/piuzuppa"
import { NuovoOspite } from "./components/NuovoOspite"
import { NuovoUtente } from "./components/NuovoUtente"
import { NuovoEnte } from "./components/NuovoEnte"
import { GestioneOspiti } from "./components/GestioneOspiti"
import { GestioneMagazzino } from "./components/GestioneMagazzino"
import { GestioneUtenti } from "./components/GestioneUtenti"
import { VisualizzaUtente } from "./components/VisuallizzaUtente"
import { VisualizzaOspite } from "./components/VisualizzaOspite"
import { GestioneEnti } from "./components/GestioneEnti"
import { Tendone } from "./components/TopBar"
import { useAuth } from "./components/AuthContext"

const sidebarItems: SidebarConfig[] = [
  {
    key: "ospiti",
    label: "Ospiti",
    path: "ospiti",
    subItems: [
      { label: "Inserimento nuovo ospite", path: "nuovo-ospite" },
      { label: "Anagrafica Ospiti", path: "anagrafica-ospiti" },
      { label: "Anagrafica enti", path: "anagrafica-enti" }

    ]
  },
  {
    key: "magazzino",
    label: "Magazzino",
    path: "magazzino",
    subItems: [
      { label: "Giacenze", path: "giacenze" },
      { label: "Stoccaggio", path: "stoccaggio" },
      { label: "Prelievo", path: "prelievo" }
    ]
  },
  {
    key: "cucina",
    label: "Cucina",
    path: "cucina",
  },
  {
    key: "accoglienza",
    label: "Accoglienza",
    path: "accoglienza",
  },
  {
    key: "utenti",
    label: "Utenti",
    path: "utenti",
    subItems: [
      { label: "Inserimento nuovo utente", path: "nuovo-utente" },
      { label: "Anagrafica utenti", path: "utenti" }
    ]
  },
]

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}

function App() {
  const { user } = useAuth()

  return (
    <>
      <main className="w-full">
        <Routes>
          <Route
            index
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="home"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="mr-4 flex">
                    <Sidebar sidebarItems={sidebarItems} />
                    <section className="ml-4 mt-6 flex min-h-[60vh] w-full items-center justify-center px-8 py-8">
                      <div className="w-full max-w-2xl text-center">
                        <h1 className="font-chalk text-5xl text-bordeaux drop-shadow-[0_2px_3px_rgba(255,255,255,0.45)]">
                          Ciao{user?.nome ? `, ${user.nome}` : ""}!
                        </h1>
                        <p className="mt-3 text-bordeaux/90">
                          Siamo felici di averti qui!
                        </p>
                        <div className="mt-6 rounded-xl bg-white/55 p-4 shadow-md">
                          <p className="font-bold text-bordeaux">Come orientarti rapidamente:</p>
                          <p className="mt-2 text-bordeaux/95">
                            Nel menu a sinistra trovi le sezioni di navigazione.
                          </p>
                          <p className="text-bordeaux/95">
                            In alto a destra puoi cambiare il punto di distribuzione.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="anagrafiche"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <GestioneOspiti />
                    <GestioneEnti />
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="anagrafica-ospiti"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <GestioneOspiti />
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="anagrafica-enti"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <GestioneEnti />
                  </div>
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="nuovo-ospite"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <NuovoOspite />
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="nuovo-utente"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <NuovoUtente />
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="nuovo-ente"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <NuovoEnte />
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="utenti"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <GestioneUtenti />
                  </div>
                </>
              </ProtectedRoute>
            } />
          <Route
            path="visualizza-utente/:id"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <VisualizzaUtente />
                  </div>
                </>
              </ProtectedRoute>
            } />
          <Route
            path="visualizza-ospite/:id"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <VisualizzaOspite />
                  </div>
                </>
              </ProtectedRoute>
            } />
          <Route
            path="magazzino"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <GestioneMagazzino />
                  </div>
                </>
              </ProtectedRoute>
            } />
          <Route
            path="giacenze"
            element={
              <ProtectedRoute>
                <>
                  <Tendone />
                  <div className="flex mr-4">
                    <Sidebar sidebarItems={sidebarItems} />
                    <GestioneMagazzino />
                  </div>
                </>
              </ProtectedRoute>
            } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
