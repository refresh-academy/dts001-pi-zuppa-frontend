import { SubmitEvent, useState } from "react"
import { useNavigate } from "react-router" 
import { createUser } from "../api/backend"
import type {
  PuntoDiDistribuzione,
  Ruolo,
  User,
} from "../types/piuzuppa"
import { Eye, EyeOff } from "lucide-react"

export function NuovoUtente() {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [accessLevel, setAccessLevel] = useState<User["livelloAccesso"] | "">("")
    const [site, setSite] = useState<PuntoDiDistribuzione[]>([])
    const [role, setRole] = useState<Ruolo[]>([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate() 
    const isFormValid =
      Boolean(name.trim()) &&
      Boolean(surname.trim()) &&
      Boolean(username.trim()) &&
      Boolean(password) &&
      password === passwordConfirm &&
      Boolean(accessLevel)
    
    const toggleSelection = <T,>(list: T[], value: T, setter: (val: T[]) => void) => {
  if (list.includes(value)) {
    setter(list.filter((item) => item !== value));
  } else {
    setter([...list, value]);
  }
};

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (
          name.trim() &&
          surname.trim() &&
          username.trim() &&
          password &&
          password === passwordConfirm &&
          accessLevel !== ""
        ) {
            await createUser({
              name,
              surname,
              phone,
              username,
              password,
              email,
              accessLevel,
              site,
              role
            })
            navigate("/utenti"); 
        } else {alert("Compila i campi obbligatori, seleziona il livello di accesso e controlla che le password coincidano.")}
    }

  return (
    <div 
      className="top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xl border-12 border-y-amber-900  border-x-amber-800 py-8 pr-8 shadow-2xl bg-amber-950" 
      style={{ 
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)`, 
      }}
    >
      <h1 className="text-giallo pl-8 text-2xl font-bold">Nuovo Utente</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-12 gap-y-6 p-8 items-end">
        <div className="col-span-2 grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-bianco text-sm">Nome:</label>
            <input 
              id="name"
              onChange={(event) => setName(event.target.value)} 
              type="text" placeholder="nome" 
              value={name}
              className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-bianco text-sm">Cognome:</label>
            <input 
              id="surname"
              onChange={(event) => setSurname(event.target.value)} 
              type="text" placeholder="cognome" 
              value={surname}
              className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-bianco text-sm">Nome Utente:</label>
            <input 
              onChange={(event) => setUsername(event.target.value)}
              value={username}
              id="username" type="text" placeholder="scegli nome utente" className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Telefono:</label>
          <input 
            id="phone"
            onChange={(event) => setPhone(event.target.value)} 
            type="tel" placeholder="telefono"
            value={phone}
            className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Email:</label>
          <input 
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            id="email" type="email" placeholder="email" className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>

        <div className="flex flex-col gap-1">
          
          <label className="text-bianco text-sm">Password:</label>
          <div className="flex justify-between gap-4">
            <input 
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              id="password" type={showPassword ? "text" : "password"} 
              placeholder="password" className="border-2 bg-sabbia border-bordeaux rounded-md w-full px-2 h-10 outline-none" />
          <button
                type="button"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-bordeaux bg-sabbia text-bordeaux hover:bg-giallo"
                aria-label={
                  showPassword ? "Nascondi password" : "Mostra password"
                }>
                {showPassword ? <Eye size={16 } /> : <EyeOff size={16} />}
              </button></div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Conferma la password:</label>
          <div className="flex justify-between gap-4">
            <input 
          onChange={(event) => setPasswordConfirm(event.target.value)}
          value={passwordConfirm}
          id="passwordConfirm" type={showPassword ? "text" : "password"} placeholder="password" 
          className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 w-full outline-none" />
        <button
          type="button"
          onClick={() => setShowPassword((currentValue) => !currentValue)}
          className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-bordeaux bg-sabbia text-bordeaux hover:bg-giallo"
          aria-label={
            showPassword ? "Nascondi password" : "Mostra password"
          }>
          {showPassword ? <Eye size={16 } /> : <EyeOff size={16} />}
        </button>
          </div>
          
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
                      setAccessLevel(event.target.value as User["livelloAccesso"])
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
                    className="peer appearance-none h-6 w-6 rounded-md border-2 border-bordeaux bg-sabbia checked:border-amber-500 checked:bg-amber-900 transition-all"
                  />
                  <div className="pointer-events-none absolute text-sm font-bold text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                    ✓
                  </div>
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
                    className="peer appearance-none h-6 w-6 rounded-md border-2 border-bordeaux bg-sabbia checked:border-amber-500 checked:bg-amber-900 transition-all"
                  />
                  <div className="pointer-events-none absolute text-sm font-bold text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                    ✓
                  </div>
                </div>
                <span className="text-bianco capitalize group-hover:text-giallo transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className="h-10 rounded-md font-bold text-white shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-amber-950 disabled:text-white/50 disabled:shadow-none enabled:bg-amber-900 enabled:hover:bg-amber-800"
        >
          REGISTRA
        </button>
      </form>
    </div>
  );
}
