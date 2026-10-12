let writeQueue: Promise<void> = Promise.resolve();

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export interface LocalStoreData<TProduct, TOrder> {
  products: TProduct[];
  orders: TOrder[];
  hiddenStockListIds: number[];
}

export async function loadStoreData<TProduct, TOrder>(
  initialProducts: TProduct[],
): Promise<LocalStoreData<TProduct, TOrder>> {
  return {
    products: readStoredValue("toko-pakaian:products", initialProducts),
    orders: readStoredValue("toko-pakaian:orders", []),
    hiddenStockListIds: readStoredValue("toko-pakaian:hidden-stock", []),
  };
}

export function saveStoreData<TProduct, TOrder>(
  products: TProduct[],
  orders: TOrder[],
  hiddenStockListIds: number[],
): Promise<void> {
  const save = async () => {
    window.localStorage.setItem("toko-pakaian:products", JSON.stringify(products));
    window.localStorage.setItem("toko-pakaian:orders", JSON.stringify(orders));
    window.localStorage.setItem(
      "toko-pakaian:hidden-stock",
      JSON.stringify(hiddenStockListIds),
    );
  };

  writeQueue = writeQueue.then(save, save);
  return writeQueue;
}