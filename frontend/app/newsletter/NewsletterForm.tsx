"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await api.newsletter.subscribe({ email, name });
        setMessage(
          response.confirmation_token
            ? "Subscription received. The API returned a confirmation token."
            : "Subscription received.",
        );
        setEmail("");
        setName("");
      } catch {
        setMessage("The subscription request failed. Try again in a moment.");
      }
    });
  }

  return (
    <form className="space-y-4 rounded-lg border border-border bg-card p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          className="h-12"
          placeholder="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          required
          className="h-12"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button disabled={isPending} type="submit">
          {isPending ? "Enviando..." : "Inscrever"}
        </Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </div>
    </form>
  );
}
