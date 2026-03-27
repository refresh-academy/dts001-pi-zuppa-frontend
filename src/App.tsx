import { Login } from "./components/login"
import "./App.css"
import { Navbar } from "./components/navbar"
import { Sidebar } from "./components/sidebar"
import { Route, Routes } from "react-router"
import type { SidebarConfig } from "./types/piuzuppa"
import { AnagraficaOspite } from "./components/GestioneAnagrafiche"
import { AnagraficaUtenti } from "./components/GestioneUtenti"

const sidebarItems: SidebarConfig[] = [
  {
    key: "anagrafiche",
    label: "Anagrafiche",
    path: "anagrafiche",
    subItems : [
      {label: "Inserimento nuovo ospite", path: "nuovo-ospite"},
      {label:"Modifica anagrafica ospite", path: "modifica-ospite"},
      {label: "Anagrafica enti", path: "anagrafica-enti"}

]
  },
  {
    key: "magazzino",
    label: "Magazzino",
    path: "magazzino",
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
                <Navbar />
                <Sidebar sidebarItems={sidebarItems} />
              </>
            }
          />
          <Route
            path="anagrafiche"
            element={
              <>
                <Navbar />
                <div className="flex mr-4">
                <Sidebar sidebarItems={sidebarItems} />
                <AnagraficaOspite />
                </div>
              </>
            }
          />
          <Route
            path="utenti"
            element={
              <>
                <Navbar />
                <div className="flex mr-4">
                <Sidebar sidebarItems={sidebarItems} />
                <AnagraficaUtenti />
                </div>
              </>
            }/>
        {/* <Route path='' element = {<Login/>}/>
       
       <Route path='Forse' element = {<Forse/>}/>
        <Route path='Archivio' element = {<Archivio/>}/>
        <Route path='Attesa' element = {<Attesa/>}/>
           <Route path='Cestino' element = {<Cestino/>}/>  */}
        </Routes>
      </main>
    </>
  )
}

export default App
