import { submitForm } from "./actions";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold tracking-tight">Restaurant SaaS Platform</h1>
      </div>
      <div className="mt-8">
        <form action={submitForm} className="flex flex-col space-y-4">
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90">
            Test Server Action
          </button>
        </form>
      </div>
    </main>
  );
}
