type OrderItemInput = {
  fileName: string;
  printQty?: number;
  copyQty?: number;
};

type PreviewOrderInput = {
  items?: OrderItemInput[];
  pickupMethod?: "pickup" | "delivery";
};

export function buildOrderSummary(payload: PreviewOrderInput) {
  const normalizedItems = (payload.items ?? []).map((item) => {
    const printQty = Number(item.printQty ?? 0);
    const copyQty = Number(item.copyQty ?? 0);
    const sourcePrintQty = copyQty > 0 && printQty === 0 ? 1 : 0;
    const totalPrintedSheets = printQty + sourcePrintQty;

    return {
      fileName: item.fileName,
      printQty,
      copyQty,
      sourcePrintQty,
      totalPrintedSheets
    };
  });

  return {
    pickupMethod: payload.pickupMethod ?? "pickup",
    totalFiles: normalizedItems.length,
    items: normalizedItems
  };
}
