import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMealLogs, type MealLogSummary } from "../api/backend";
import { RicercaTabella } from "./RicercaTabella";

const columns = [
  "Ospite",
  "Numero pasti",
  "Modalità di ricevimento",
  "Consegnato",
];

export function GestioneAccoglienzaDistribuzione() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [mealLogs, setMealLogs] = useState<MealLogSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchValue = searchTerm.trim().toLowerCase();

  useEffect(() => {
    const loadMealLogs = async () => {
      try {
        const loadedMealLogs = await getMealLogs();
        setMealLogs(loadedMealLogs);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMealLogs();
  }, []);

  const filteredMealLogs = mealLogs.filter((mealLog) =>
    mealLog.guestName.toLowerCase().includes(searchValue)
  );

  const sortedRows = [...filteredMealLogs]
    .sort((a, b) =>
      a.guestName.localeCompare(b.guestName, "it", { sensitivity: "base" })
    )
    .map((mealLog) => ({
      id: mealLog.id,
      data: [
        mealLog.guestName,
        String(mealLog.mealsCount),
        mealLog.receivingMode,
        mealLog.delivered ? "Si" : "No",
      ],
    }));

  const tableRows = isLoading
    ? [
        {
          id: "loading",
          data: ["Caricamento...", "", "", ""],
        },
      ]
    : sortedRows;

  const handleRowClick = (id: string) => {
    navigate(`/consegna-pasto/${id}`);
  };

  return (
    <RicercaTabella
      title="Accoglienza e Distribuzione"
      columns={columns}
      rows={tableRows}
      onSearchChange={setSearchTerm}
      searchLabel="Cerca ospite"
      searchPlaceholder="nome ospite"
      showNewButton={false}
      onRowClick={isLoading ? undefined : handleRowClick}
    />
  );
}
