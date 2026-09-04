"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

/**
 * Cópia do SearchBox do Stylos, com os placeholders trocados pelos termos da oficina.
 * Na maquete a busca filtra a vitrine em memória; no Stylos ela leva para /search.
 */
export default function SearchBox({ onBuscar }: { onBuscar: (q: string) => void }) {
  const [query, setQuery] = useState("");
  return (
    <div className="relative flex w-full items-center justify-center">
      <PlaceholdersAndVanishInput
        placeholders={[
          "Buscar na loja...",
          "Camiseta The Dark Film",
          "Caneca para o café da oficina",
          "Faróis de LED",
          "O que você procura?",
        ]}
        onChange={(e) => setQuery(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          onBuscar(query.trim().toLowerCase());
        }}
      />
    </div>
  );
}
