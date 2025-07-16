export default function Card({ title, value, icon, className }) {
  return (
    <div
      className={`relative h-[6rem] border border-black/10 rounded-lg ${className}`}
    >
      <p className="absolute top-4 left-4 font-semibold text-sm text-black/80">
        {title}
      </p>
      <p className="absolute bottom-4 left-4 font-medium text-2xl">{value}</p>
      <div className="absolute top-4 right-4">{icon}</div>
    </div>
  );
}
