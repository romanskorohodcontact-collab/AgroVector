import type { Load } from "../model";

interface LoadCardProps {
  load: Load;
}

export function LoadCard({ load }: LoadCardProps) {
  return (
    <article style={{ border: "1px solid #000", padding: "16px" }}>
      <p>Место погрузки: {load.loadingPlace}</p>
      <p>
        Координаты: {load.loadingLocation.lat}, {load.loadingLocation.lng}
      </p>
      <p>Место выгрузки: {load.unloadingPlace}</p>
      <p>Расстояние: {load.distance} км</p>
      <p>Ставка: {load.rate}</p>
      <p>Тоннаж: {load.tonnage} т</p>
      <p>Груз: {load.cargo}</p>
      <p>Доп. информация: {load.additionalInfo}</p>
      <p>Имя заказчика: {load.customerName}</p>
      <p>Телефон заказчика: {load.customerPhone}</p>
      <p>Название компании: {load.companyName}</p>
    </article>
  );
}