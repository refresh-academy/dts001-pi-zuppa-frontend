import { fetchUserToChange, getInitialUsers } from "../api/backend"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { RicercaTabella } from "./RicercaTabella"
import { User } from "../types/piuzuppa";

const columns = ['Nome ente', 'e-mail', 'telefono', 'indirizzo'];

const staticRows = [
    { id: '1', data: ['Caritas', 'caritas@email.it', '051 5815663', 'via avesella 15'] },
    { id: '2', data: ['CSM', 'mazzacorati@email.it', '051783456', 'via toscana 18'] },
    { id: '3', data: ['Comune di Bologna', 'comunebologna@email.it', '051891273', 'Piazza Maggiore 1'] },
];

export function GestioneEnti() {
    const [rows, setRows] = useState<Ente[]>(staticRows);

    const handleSearch = (value: string) => {
        const filtered = staticRows.filter(ente =>
            Object.values(ente).some(val =>
                val.toLowerRows().includes(value.toLowerRows())
            )
        );

        setRows(filtered);
    };

    return (
        <RicercaTabella
            title="Gestione Enti"
            columns={columns}
            rows={rows.map(r => ({
                id: r.id,
                data: [r.nome, r.email, r.telefono, r.indirizzo]
            }))}
            onSearchChange={handleSearch}
        />
    );
}