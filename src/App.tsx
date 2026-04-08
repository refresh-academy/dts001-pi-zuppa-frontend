import { Login } from "./components/Login"
import "./App.css"
import { Sidebar } from "./components/Sidebar"
import { Navigate, Route, Routes } from "react-router"
import type { SidebarConfig } from "./types/piuzuppa"
import { NuovoOspite } from "./components/NuovoOspite"
import {  NuovoUtente } from "./components/NuovoUtente"
import { GestioneOspiti, } from "./components/GestioneAnagrafiche"
import { GestioneMagazzino } from "./components/GestioneMagazzino"
import { GestioneUtenti } from "./components/GestioneUtenti"
import { VisualizzaUtente } from "./components/VisuallizzaUtente"
import { Tendone } from "./components/TopBar"
import { useAuth } from "./components/AuthContext"

const sidebarItems: SidebarConfig[] = [
  {
    key: "anagrafiche",
    label: "Anagrafiche",
    path: "anagrafiche",
    subItems : [
      {label: "Inserimento nuovo ospite", path: "nuovo-ospite"},
      {label: "Anagrafica Ospiti", path: "anagrafica-ospiti"},
      {label: "Anagrafica enti", path: "anagrafica-enti"}

]
  },
  {
    key: "magazzino",
    label: "Magazzino",
    path: "magazzino",
    subItems : [
      {label: "Giacenze", path: "giacenze"},
      {label: "Stoccaggio", path: "stoccaggio"},
      {label: "Prelievo", path: "prelievo"}
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
    subItems : [
      {label: "Inserimento nuovo utente", path: "nuovo-utente"},
      {label: "Anagrafica utenti", path: "utenti"}
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
                  <Sidebar sidebarItems={sidebarItems} />
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
            }/>
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
            }/>
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
            }/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
