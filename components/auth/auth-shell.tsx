import type { ReactNode } from "react";

interface Feature {
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    title: "Describe it in plain English",
    description: "An AI agent maps your prompt onto a live system design canvas.",
  },
  {
    title: "Refine it together",
    description: "Collaborate on the architecture in real time with your team.",
  },
  {
    title: "Ship a technical spec",
    description: "Turn the finished graph into a persistent Markdown document.",
  },
];

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen w-full bg-background text-foreground">
      <section className="hidden w-1/2 flex-col items-center justify-center border-r border-border px-16 lg:flex">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Ghost AI
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-balance">
            Design systems together, in real time.
          </h1>

          <p className="mt-4 max-w-sm text-base text-muted-foreground text-balance">
            A collaborative workspace that turns plain-English prompts into
            living architecture diagrams.
          </p>

          <ul className="mt-12 w-full space-y-3 text-left">
            {FEATURES.map(({ title, description }) => (
              <li
                key={title}
                className="rounded-2xl border border-border bg-card/40 p-4"
              >
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </section>
    </main>
  );
}
