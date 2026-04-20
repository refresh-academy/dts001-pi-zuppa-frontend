import { useState } from "react";
import { RicercaTabella } from "./RicercaTabella";

type ProdottoMagazzino = {
  id: string;
  nome: string;
  categoria: string;
  quantita: number;
  unitaMisura: "pz" | "kg" | "lt";
  lotto: string;
  scadenza: string;
  ubicazione: string;
  stato: "OK" | "Sotto scorta" | "In scadenza" | "Scaduto";
};

const columns = [
  "Prodotto",
  "Categoria",
  "Quantità",
  "UM",
  "Lotto",
  "Scadenza",
  "Ubicazione",
  "Stato",
];

const prodottiIniziali: ProdottoMagazzino[] = [
  {
    id: "1",
    nome: "Pasta penne",
    categoria: "Secco",
    quantita: 80,
    unitaMisura: "kg",
    lotto: "PEN2404",
    scadenza: "2027-11-06",
    ubicazione: "Scaffale A1",
    stato: "OK",
  },
  {
    id: "2",
    nome: "Passata pomodoro",
    categoria: "Conserve",
    quantita: 12,
    unitaMisura: "pz",
    lotto: "PAS2412",
    scadenza: "2026-11-01",
    ubicazione: "Scaffale B2",
    stato: "In scadenza",
  },
  {
    id: "3",
    nome: "Riso",
    categoria: "Secco",
    quantita: 6,
    unitaMisura: "kg",
    lotto: "RIS2403",
    scadenza: "2027-03-10",
    ubicazione: "Scaffale A3",
    stato: "Sotto scorta",
  },
  {
    id: "4",
    nome: "Latte UHT",
    categoria: "Bevande",
    quantita: 24,
    unitaMisura: "lt",
    lotto: "LAT2410",
    scadenza: "2025-12-15",
    ubicazione: "Frigo C1",
    stato: "Scaduto",
  },
  {
    id: "5",
    nome: "Ceci",
    categoria: "Legumi",
    quantita: 35,
    unitaMisura: "kg",
    lotto: "CEC2408",
    scadenza: "2027-08-21",
    ubicazione: "Scaffale A2",
    stato: "OK",
  },
];

export function GestioneMagazzino() {
  const [statusFilter, setStatusFilter] = useState<
    "tutti" | "sotto-scorta" | "in-scadenza" | "scaduti"
  >("tutti");
  const [searchTerm, setSearchTerm] = useState("");

  const searchValue = searchTerm.trim().toLowerCase();

  const filteredRows = prodottiIniziali.filter((prodotto) => {
    const matchesSearch =
      `${prodotto.nome} ${prodotto.categoria} ${prodotto.ubicazione}`
        .toLowerCase()
        .includes(searchValue);

    if (!matchesSearch) return false;
    if (statusFilter === "tutti") return true;
    if (statusFilter === "sotto-scorta") return prodotto.stato === "Sotto scorta";
    if (statusFilter === "in-scadenza") return prodotto.stato === "In scadenza";
    return prodotto.stato === "Scaduto";
  });

  const sortedRows = [...filteredRows].sort((a, b) =>
    a.nome.localeCompare(b.nome, "it", { sensitivity: "base" })
  );

  const tableRows = sortedRows.map((prodotto) => ({
    id: prodotto.id,
    data: [
      prodotto.nome,
      prodotto.categoria,
      String(prodotto.quantita),
      prodotto.unitaMisura,
      prodotto.lotto,
      prodotto.scadenza,
      prodotto.ubicazione,
      prodotto.stato,
    ],
  }));

  const sottoScortaCount = prodottiIniziali.filter(
    (prodotto) => prodotto.stato === "Sotto scorta"
  ).length;
  const inScadenzaCount = prodottiIniziali.filter(
    (prodotto) => prodotto.stato === "In scadenza"
  ).length;
  const scadutiCount = prodottiIniziali.filter(
    (prodotto) => prodotto.stato === "Scaduto"
  ).length;

  return (
    <div className="w-full">
      <div className="ml-4 mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border-2 border-amber-900 bg-black/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-giallo/80">
            Totale prodotti
          </p>
          <p className="mt-2 text-2xl font-bold text-bianco">{prodottiIniziali.length}</p>
        </div>
        <div className="rounded-xl border-2 border-red-800 bg-red-950/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-200">
            Sotto scorta
          </p>
          <p className="mt-2 text-2xl font-bold text-red-100">{sottoScortaCount}</p>
        </div>
        <div className="rounded-xl border-2 border-amber-800 bg-amber-950/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">
            In scadenza
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-100">{inScadenzaCount}</p>
        </div>
        <div className="rounded-xl border-2 border-red-900 bg-red-950/55 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-300">Scaduti</p>
          <p className="mt-2 text-2xl font-bold text-red-200">{scadutiCount}</p>
        </div>
      </div>

      <div className="ml-4 mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("tutti")}
          className={`rounded-md border px-3 py-1.5 text-sm font-bold ${
            statusFilter === "tutti"
              ? "border-amber-700 bg-giallo text-bordeaux"
              : "border-amber-900 bg-black/50 text-giallo"
          }`}
        >
          Tutti
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("sotto-scorta")}
          className={`rounded-md border px-3 py-1.5 text-sm font-bold ${
            statusFilter === "sotto-scorta"
              ? "border-red-700 bg-red-300 text-red-900"
              : "border-red-900 bg-black/50 text-red-200"
          }`}
        >
          Sotto scorta
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("in-scadenza")}
          className={`rounded-md border px-3 py-1.5 text-sm font-bold ${
            statusFilter === "in-scadenza"
              ? "border-amber-700 bg-amber-200 text-amber-950"
              : "border-amber-900 bg-black/50 text-amber-200"
          }`}
        >
          In scadenza
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("scaduti")}
          className={`rounded-md border px-3 py-1.5 text-sm font-bold ${
            statusFilter === "scaduti"
              ? "border-red-800 bg-red-400 text-red-950"
              : "border-red-900 bg-black/50 text-red-300"
          }`}
        >
          Scaduti
        </button>
      </div>

      <RicercaTabella
        title="Giacenze Magazzino"
        columns={columns}
        rows={tableRows}
        onSearchChange={setSearchTerm}
        searchLabel="Cerca prodotto"
        searchPlaceholder="nome prodotto"
        showNewButton={false}
      />
    </div>
  );
}
