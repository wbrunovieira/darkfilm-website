"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

/**
 * Busca da loja, com os termos da oficina rodando no lugar do texto de exemplo.
 * Na maquete ela filtra a vitrine em memória; na loja real vai levar para a página de resultados.
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
