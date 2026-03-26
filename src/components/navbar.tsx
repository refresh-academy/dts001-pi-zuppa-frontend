export  function Navbar() {
  return (
    <nav className="w-full px-6 py-2 flex items-center justify-between border-b-12 border-b-amber-900 bg-giallo">
     
      <button
        className="px-8 py-1 rounded-lg bg-amber-700 border-b-6 border-x-2 border-x-amber-900 border-b-amber-950 text-amber-950 shadow-lg transition duration-150 hover:-translate-y-0.5 active:translate-y-1 font-semibold"
        style={{ textShadow: "0 -2px 0 rgba(255,255,255,0.18), 0 1px 1px rgba(0,0,0,0.45)" }}
      >
        piùZuppa
      </button>
      <button
        className="px-8 py-1 rounded-lg bg-amber-700 border-b-6 border-x-2 border-x-amber-900 border-b-amber-950 text-amber-950 shadow-lg transition duration-150 hover:-translate-y-0.5 active:translate-y-1 font-semibold"
        style={{ textShadow: "0 -2px 0 rgba(255,255,255,0.22), 0 1px 1px rgba(0,0,0,0.5)" }}
      >
        Log in
      </button>
    </nav>
  )
}
