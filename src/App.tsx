import { Login } from "./components/login"
import "./App.css"
import { Navbar } from "./components/navbar"
import { Sidebar } from "./components/sidebar"
import { Route, Routes } from "react-router"
import type { SidebarConfig } from "./types/piuzuppa"

const sidebarItems: SidebarConfig[] = [
  {
    key: "gestione-anagrafiche",
    label: "Gestione Anagrafiche",
    path: "gestione-anagrafiche",
  },
  {
    key: "gestione-magazzino",
    label: "Gestione Magazzino",
    path: "gestione-magazzino",
  },
  {
    key: "gestione-cucina",
    label: "Gestione Cucina",
    path: "gestione-cucina",
  },
  {
    key: "gestione-accoglienza/distribuzione",
    label: "Gestione Accoglienza/Distribuzione",
    path: "gestione-accoglienza-distribuzione",
  },
  {
    key: "gestione-utenti",
    label: "Gestione Utenti",
    path: "gestione-utenti",
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
