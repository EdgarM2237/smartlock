"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">Pagina no encontrada</h1>
      <p className="text-muted-foreground">La pagina que estás buscando no pudo ser encontrada.</p>
      <Link prefetch={false} replace href="/dashboard/default">
        <Button variant="outline">Volver a la pagina principal</Button>
      </Link>
    </div>
  );
}
