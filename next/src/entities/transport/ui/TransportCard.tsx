import type { Transport } from "../model";

interface TransportCardProps {
  transport: Transport;
}

export function TransportCard({ transport }: TransportCardProps) {
  return (
    <article style={{ border: "1px solid #000", padding: "16px" }}>
      <p>Тип транспорта: {transport.vehicleType}</p>
      <p>Грузоподъёмность: {transport.capacityTons} т</p>
      <p>Регион: {transport.region}</p>
    </article>
  );
}