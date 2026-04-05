import { randomUUID } from "node:crypto";

export function createId(prefix: string) {
  void prefix;
  return randomUUID();
}

export function createOrderCode() {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GP-${new Date().getFullYear()}-${random}`;
}
