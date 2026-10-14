const COLORS = ['#FEF7EC', '#BFE6C6', '#D9C6E4', '#F3C6CE'];

export default function Rings({ size = 30, row = false }: { size?: number; row?: boolean }) {
  return (
    <div className={row ? 'rings rings--row' : 'rings'} aria-hidden="true">
      {COLORS.map((c) => (
        <span key={c} className="rg" style={{ width: size, height: size, borderColor: c }} />
      ))}
    </div>
  );
}
