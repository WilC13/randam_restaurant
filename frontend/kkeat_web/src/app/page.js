"use client";

import React from "react";
import Home from "../components/Home";
import { ClientOnlyProvider } from "@/hooks/ClientOnly";

const Page = () => {
  return (
    <ClientOnlyProvider>
      <Home />
    </ClientOnlyProvider>
  );
};

export default Page;
