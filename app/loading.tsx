export default function Loading() {
  return (
    <main className="wrap block" aria-busy="true">
      <div className="label">Loading YURJIVA</div>
      <progress aria-label="Loading page" />
    </main>
  );
}
