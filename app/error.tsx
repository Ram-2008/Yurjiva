"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="wrap block">
      <h2>Something interrupted this page.</h2>
      <button className="primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
