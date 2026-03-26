import { Login } from "./components/login"
import "./App.css"
import { Navbar } from "./components/navbar"
import { Sidebar } from "./components/sidebar"
import { Route, Routes } from "react-router"
import type { SidebarConfig } from "./types/piuzuppa"

const sidebarItems: SidebarConfig[] = [
  {
    key: "anagrafiche",
    label: "Anagrafiche",
    path: "anagrafiche",
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
