export  function Navbar() {
  return (
    <nav className="w-full px-6 py-2 flex items-center justify-between border-b-12 border-b-amber-900 bg-giallo">
     
      <button
        className="min-w-36 py-1 rounded-lg  bg-amber-800 border-b-6 border-x-2 border-x-amber-900 border-b-amber-950 text-white shadow-lg transition duration-150 hover:-translate-y-1 hover:opacity-70 active:translate-y-1 font-bold"
        style={{ textShadow: "0 -2px 0 rgba(255,255,255,0.18), 0 1px 1px rgba(0,0,0,0.45)" }}
      >
        piùZuppa
      </button>
      <button
        className="px-8 py-1 rounded-lg bg-amber-800 border-b-6 border-x-2 border-x-amber-900 border-b-amber-950 text-white shadow-lg transition duration-150 hover:-translate-y-1 active:translate-y-1 font-bold"
        style={{ textShadow: "0 -2px 0 rgba(255,255,255,0.22), 0 1px 1px rgba(0,0,0,0.5)" }}
      >
        Log in
      </button>
    </nav>
  )
}
