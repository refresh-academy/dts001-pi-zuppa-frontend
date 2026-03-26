export  function Navbar() {
  return (
    <nav className="w-full px-6 py-2 flex items-center justify-between  bg-salvia">
     
      <button className="min-w-36 py-1 rounded-lg bg-giallo text-black shadow-lg hover:opacity-70 hover:scale-110 transition font-bold">
       piùZuppa
      </button>
      <button className="px-8 py-1 rounded-lg bg-giallo text-black shadow-lg hover:opacity-70 hover:scale-110 transition font-bold">
       Log in
      </button>
    </nav>
  )
}
