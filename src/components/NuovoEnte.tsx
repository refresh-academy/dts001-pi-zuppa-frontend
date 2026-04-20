import { useState } from "react";
import { useNavigate } from "react-router";
import { createEnte } from "../api/backend";

export function NuovoEnte() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitNotice, setSubmitNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

  const inputClassName =
    "h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none";

  const isFormValid =
    Boolean(nome.trim()) &&
    Boolean(email.trim()) &&
    Boolean(telefono.trim()) &&
    Boolean(indirizzo.trim()) &&
    !isSaving;

  const handleSaveEnte = async () => {
    if (!isFormValid) {
      setSubmitNotice("");
      setErrorNotice("Compila tutti i campi prima di salvare.");
      return;
    }

    setIsSaving(true);
    setSubmitNotice("");
    setErrorNotice("");

    const result = await createEnte({
      nome: nome.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      indirizzo: indirizzo.trim(),
    });

    if ("error" in result) {
      setErrorNotice(result.error);
      setIsSaving(false);
      return;
    }

    setSubmitNotice("Ente creato con successo. Reindirizzamento in corso...");
    window.setTimeout(() => navigate("/anagrafica-enti"), 2000);
  };

  return (
    <div
      className="top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 p-8 shadow-2xl md:p-10"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)",
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-left text-2xl font-bold text-giallo">Nuovo Ente</h1>
        <p className="pt-2 text-left text-sm font-semibold text-bianco/90">
          Inserisci i dati dell&apos;ente.
        </p>
        <div className="pt-3">
          {errorNotice ? <p className="text-sm font-semibold text-red-400">{errorNotice}</p> : null}
          {submitNotice ? <p className="text-sm font-semibold text-green-400">{submitNotice}</p> : null}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            void handleSaveEnte()
          }}
          className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nome-ente" className="text-sm font-semibold text-bianco">
              Nome
            </label>
            <input
              id="nome-ente"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email-ente" className="text-sm font-semibold text-bianco">
              Email
            </label>
            <input
              id="email-ente"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="telefono-ente" className="text-sm font-semibold text-bianco">
              Telefono
            </label>
            <input
              id="telefono-ente"
              type="tel"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="indirizzo-ente" className="text-sm font-semibold text-bianco">
              Indirizzo
            </label>
            <input
              id="indirizzo-ente"
              type="text"
              value={indirizzo}
              onChange={(event) => setIndirizzo(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="flex justify-center pt-2 lg:col-span-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className="h-10 min-w-36 rounded-md bg-amber-900 px-7 font-bold text-white shadow-lg transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-amber-950 disabled:text-white/50"
            >
              {isSaving ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
