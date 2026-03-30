import { Login } from "./components/login"
import "./App.css"
import { Navbar } from "./components/navbar"
import { Sidebar } from "./components/sidebar"
import { Route, Routes } from "react-router"
import type { SidebarConfig } from "./types/piuzuppa"
import { NuovoOspite } from "./components/NuovoOspite"
import {  NuovoUtente } from "./components/NuovoUtente"
import { GestioneOspiti, } from "./components/GestioneAnagrafiche"
import { GestioneMagazzino } from "./components/GestioneMagazzino"
import { GestioneUtenti } from "./components/GestioneUtenti"
import { Tendone } from "./components/Tendone-bar"

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

function App() {
  return (
    <>
      <main className="w-full">
        <Routes>
          <Route index element={<Login />} />
          <Route
            path="home"
            element={
              <>
                <Tendone />
                <Sidebar sidebarItems={sidebarItems} />
              </>
            }
          />
          <Route
            path="anagrafiche"
            element={
              <>
                <Tendone />
                <div className="flex mr-4">
                  <Sidebar sidebarItems={sidebarItems} />
                  <GestioneOspiti />
                </div>
              </>
            }
          />
          
          <Route
            path="nuovo-ospite"
            element={
              <>
                <Tendone />
                <div className="flex mr-4">
                  <Sidebar sidebarItems={sidebarItems} />
                  <NuovoOspite />
                  
                </div>
              </>
            }
          />
           <Route
            path="nuovo-utente"
            element={
              <>
                <Tendone />
                <div className="flex mr-4">
                  <Sidebar sidebarItems={sidebarItems} />
                  <NuovoUtente />
                  
                </div>
              </>
            }
          />
          <Route
            path="utenti"
            element={
              <>
                <Tendone />
                <div className="flex mr-4">
                  <Sidebar sidebarItems={sidebarItems} />
                  <GestioneUtenti />
                </div>
              </>
            }/>
          <Route
            path="magazzino"
            element={
              <>
                <Tendone />
                <div className="flex mr-4">
                  <Sidebar sidebarItems={sidebarItems} />
                  <GestioneMagazzino />
                </div>
                </>
            }/>
        </Routes>
      </main>
    </>
  )
}

export default App
