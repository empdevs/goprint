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

export function OrderStatusTag({ status }: { status: OrderStatus }) {
  return <Tag color={colorMap[status]}>{status}</Tag>;
}
