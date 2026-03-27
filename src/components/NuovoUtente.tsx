import { addNewUser } from "../api/mock-backend"
import { FormEvent, useState } from "react"
import type {
  PuntoDiDistribuzione,
  Ruolo,
  user,
} from "../types/piuzuppa"

export function NuovoUtente() {
    const [nameAndSurname, setNameAndSurname] = useState("")
    const [accessLevel, setAccessLevel] = useState<user["livelloAccesso"] | "">("")
    const [site, setSite] = useState<PuntoDiDistribuzione[]>([])
    const [role, setRole] = useState<Ruolo[]>([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    
    const toggleSelection = <T,>(list: T[], value: T, setter: (val: T[]) => void) => {
  if (list.includes(value)) {
    setter(list.filter((item) => item !== value));
  } else {
    setter([...list, value]);
  }
};

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (password === passwordConfirm && accessLevel) {
            addNewUser({
              nomeECognome: nameAndSurname,
              username,
              password,
              livelloAccesso: accessLevel,
              puntiDistribuzione: site,
              ruoli: role,
            })
        }
    }

  return (
    <div 
      className="top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 py-8 pr-8 shadow-2xl" 
      style={{ 
        backgroundColor: "#0a0a0a", 
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)`, 
      }}
    >
      <h1 className="text-giallo pl-8 text-2xl font-bold">Nuovo Utente</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-12 gap-y-6 p-8 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Nome e Cognome:</label>
          <input 
            id="nameAndSurname"
            onChange={(event) => setNameAndSurname(event.target.value)} 
            type="text" placeholder="nome" 
            value={nameAndSurname}
            className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Nome Utente:</label>
          <input 
            onChange={(event) => setUsername(event.target.value)}
            value={username}
            id="username" type="text" placeholder="scegli nome utente" className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Password:</label>
          <input 
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          id="password" type="password" placeholder="password" className="border-2 bg-sabbia border-bordeaux rounded-md px-2 h-10 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Conderma la password:</label>
          <input 
          onChange={(event) => setPasswordConfirm(event.target.value)}
          value={passwordConfirm}
          id="passwordConfirm" type="password" placeholder="password" className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-bianco text-sm font-semibold">Livello di accesso:</label>
          <div className="flex gap-6">
            {['volontario', 'coordinatore'].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    id="accessLevel"
                    onChange={(event) =>
                      setAccessLevel(event.target.value as user["livelloAccesso"])
                    }
                    type="radio" 
                    name="accessLevel"
                    value={option}
                    className="peer appearance-none w-6 h-6 rounded-full border-2 border-bordeaux bg-sabbia checked:border-amber-500 checked:bg-amber-900 transition-all"
                  />
                  <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-bianco capitalize group-hover:text-giallo transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-bianco text-sm font-semibold">Punto di distribuzione:</label>
          <div className="flex gap-6">
            {['Saffi', 'Battiferro', 'Savena', 'San Donato'].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    checked={site.includes(option as PuntoDiDistribuzione)}
                    onChange={() => toggleSelection(site, option as PuntoDiDistribuzione, setSite)}
                    id="site"
                    type="checkbox" 
                    name="site"
                    value={option}
                    className="peer appearance-none w-6 h-6 rounded-full border-2 border-bordeaux bg-sabbia checked:border-amber-500 checked:bg-amber-900 transition-all"
                  />
                  <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-bianco capitalize group-hover:text-giallo transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

       <div className="flex flex-col gap-3">
          <label className="text-bianco text-sm font-semibold">Ruolo:</label>
          <div className="flex gap-6">
            {['cucina', 'magazzino', 'accoglienza'].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    checked={role.includes(option as Ruolo)}
                    onChange={() => toggleSelection(role, option as Ruolo, setRole)}
                    id="role"
                    type="checkbox" 
                    name="role"
                    value={option}
                    className="peer appearance-none w-6 h-6 rounded-full border-2 border-bordeaux bg-sabbia checked:border-amber-500 checked:bg-amber-900 transition-all"
                  />
                  <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-bianco capitalize group-hover:text-giallo transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="h-10 bg-amber-900 text-white font-bold rounded-md hover:bg-amber-800 transition-all shadow-lg active:scale-95">
          REGISTRA
        </button>
      </form>
    </div>
  );
}
