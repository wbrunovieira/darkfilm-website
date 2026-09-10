"use client";

import React from "react";

/** Largura máxima e respiro lateral de todas as seções da loja. */
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
};

export default Container;
