import { getSheetData } from "@/app/_lib/googleSheetsService";

export async function getTotalSales(): Promise<number> {
  const data: { totalPrice: string | number }[] = await getSheetData();

  const total = data.reduce((sum, item) => {
    let price = item.totalPrice;

    if (typeof price === "string") {
      price = parseFloat(price.replace(",", "."));
    }

    return sum + (typeof price === "number" && !isNaN(price) ? price : 0);
  }, 0);

  return total;
}

export async function getProductQuantityById(
  productId: string,
): Promise<number> {
  const data = await getSheetData();
  const totalQuantity = data.reduce((sum, item) => {
    if (item.id === productId) {
      const quantity = parseInt(String(item.quantity), 10);
      return sum + (isNaN(quantity) ? 0 : quantity);
    }

    return sum;
  }, 0);

  return totalQuantity;
}
