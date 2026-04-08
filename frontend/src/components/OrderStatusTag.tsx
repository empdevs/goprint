import { Tag } from "antd";
import { OrderStatus } from "../types";

const colorMap: Record<OrderStatus, string> = {
  pending: "gold",
  confirmed: "blue",
  processing: "cyan",
  ready_for_pickup: "green",
  out_for_delivery: "geekblue",
  completed: "success",
  cancelled: "red"
};

export function OrderStatusTag({ status, label }: { status: OrderStatus, label?: string }) {
  return <Tag color={colorMap[status]}>{label ?? status}</Tag>;
}
