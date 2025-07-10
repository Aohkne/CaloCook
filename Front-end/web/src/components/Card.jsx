export default function Card({ title, value, icon }) {
  return (
    <div className="relative h-[7rem] border border-black/20 rounded-lg">
      <p className="absolute top-4 left-4 font-semibold text-sm text-black/70">
        {title}
      </p>
      <p className="absolute bottom-9 left-4 font-medium text-2xl">{value}</p>
      <div className="absolute top-4 right-4">{icon}</div>
    </div>
  );
}
