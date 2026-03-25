 export function Login() {


  return (
    <>
   <div className='flex flex-col justify-center items-center gap-4 pt-30'>
      <img src="./src/assets/logo.png" alt="logo" />
      <div className='flex justify-center flex-row gap-4 items-center pt-8'>

        <div className='flex flex-col justify-center gap-2 '>
          <h2>Utente</h2>
          <h2>Password</h2>
        </div>

        <div className='flex flex-col justify-center gap-2'>
          <input type="text" className='border-2 bg-sabbia ' />
          <input type="text" className='border-2 bg-sabbia ' />
        </div>

      </div>

      <button className='border-2 bg-giallo w-30 hover:scale-110 hover:cursor-pointer shadow-lg'>Accedi</button>
    
</div>
    </>
  )
}
