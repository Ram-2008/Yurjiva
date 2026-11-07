export default function Brand({ full = false }: { full?: boolean }) {
  if (full) {
    return <img className="brand-emblem" src="/brand/yurjiva.webp" width={156} height={156} alt="YURJIVA" loading="lazy" />;
  }
  return (
    <span className="brand">
      <img src="/brand/orbit-y.png" width={42} height={42} alt="" />
      YURJIVA
    </span>
  );
}
