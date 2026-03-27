export function NuovoOspite() {
  return (
    <div 
      className="top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 py-8 pr-8 shadow-2xl" 
      style={{ 
        backgroundColor: "#0a0a0a", 
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)`, 
      }}
    >
      <h1 className="text-giallo pl-8 text-2xl font-bold">Nuovo Ospite</h1>
      
      <form className="grid grid-cols-2 gap-x-12 gap-y-6 p-8 items-end">
        
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Nome:</label>
          <input id="name" type="text" placeholder="nome" className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Cognome:</label>
          <input id="surname" type="text" placeholder="cognome" className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>

       
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Data di nascita:</label>
          <input id="dob" type="date" className="border-2 bg-sabbia border-bordeaux rounded-md px-2 h-10 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Telefono:</label>
          <input id="phone" type="tel" placeholder="telefono" className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>

        
        <div className="flex flex-col gap-3">
          <label className="text-bianco text-sm font-semibold">Ricevimento Pasto:</label>
          <div className="flex gap-6">
            {['asporto', 'mensa'].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="mealType" 
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

        <div className="flex flex-col gap-1">
          <label className="text-bianco text-sm">Ente della segnalazione:</label>
          <input id="agency" type="text" placeholder="nome ente" className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none" />
        </div>

        
        <div className="flex items-center gap-3 h-10">
          <label className="text-bianco text-sm">Residente:</label>
          <input 
            type="checkbox" 
            className="w-6 h-6 rounded-full border-2 border-bordeaux bg-sabbia appearance-none checked:bg-amber-900 checked:border-amber-600 transition-all cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-1.5 after:top-0.5 after:w-2 after:h-3 after:border-white after:border-b-2 after:border-r-2 after:rotate-45" 
          />
        </div>

        <button type="submit" className="h-10 bg-amber-900 text-white font-bold rounded-md hover:bg-amber-800 transition-all shadow-lg active:scale-95">
          REGISTRA
        </button>
      </form>
    </div>
  );
}
