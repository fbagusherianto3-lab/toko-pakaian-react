import { isTauri } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";

let databasePromise: Promise<Database> | undefined;
let writeQueue: Promise<void> = Promise.resolve();

function openDatabase(): Promise<Database> {
  databasePromise ??= Database.load("sqlite:toko-pakaian.db").then(
    async (database) => {
      await Promise.all([
        database.execute(
          "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, data TEXT NOT NULL)",
        ),
        database.execute(
          "CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, data TEXT NOT NULL)",
        ),
        database.execute(
          "CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
        ),
      ]);
      return database;
    },
  );
  return databasePromise;
}

function readLegacyValue<T>(key: string, fallback: T): T {
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

interface StoredRow {
  data: string;
}

export async function loadStoreData<TProduct, TOrder>(
  initialProducts: TProduct[],
): Promise<LocalStoreData<TProduct, TOrder>> {
  if (!isTauri()) {
    return {
      products: readLegacyValue("toko-pakaian:products", initialProducts),
      orders: readLegacyValue("toko-pakaian:orders", []),
      hiddenStockListIds: readLegacyValue("toko-pakaian:hidden-stock", []),
    };
  }

  const database = await openDatabase();
  const [productRows, orderRows, settingRows] = await Promise.all([
    database.select<StoredRow[]>("SELECT data FROM products ORDER BY id"),
    database.select<StoredRow[]>("SELECT data FROM orders ORDER BY rowid"),
    database.select<{ value: string }[]>(
      "SELECT value FROM settings WHERE key = ?1",
      ["hidden-stock"],
    ),
  ]);

  return {
    products: productRows.length
      ? productRows.map((row) => JSON.parse(row.data) as TProduct)
      : readLegacyValue("toko-pakaian:products", initialProducts),
    orders: orderRows.length
      ? orderRows.map((row) => JSON.parse(row.data) as TOrder)
      : readLegacyValue("toko-pakaian:orders", []),
    hiddenStockListIds: settingRows.length
      ? (JSON.parse(settingRows[0].value) as number[])
      : readLegacyValue("toko-pakaian:hidden-stock", []),
  };
}

export function saveStoreData<TProduct extends { id: number }, TOrder extends { id: string }>(
  products: TProduct[],
  orders: TOrder[],
  hiddenStockListIds: number[],
): Promise<void> {
  const save = async () => {
    if (!isTauri()) {
      window.localStorage.setItem("toko-pakaian:products", JSON.stringify(products));
      window.localStorage.setItem("toko-pakaian:orders", JSON.stringify(orders));
      window.localStorage.setItem(
        "toko-pakaian:hidden-stock",
        JSON.stringify(hiddenStockListIds),
      );
      return;
    }

    const database = await openDatabase();
    await database.execute("BEGIN TRANSACTION");
    try {
      await database.execute("DELETE FROM products");
      await database.execute("DELETE FROM orders");
      for (const product of products) {
        await database.execute(
          "INSERT INTO products (id, data) VALUES (?1, ?2)",
          [product.id, JSON.stringify(product)],
        );
      }
      for (const order of orders) {
        await database.execute(
          "INSERT INTO orders (id, data) VALUES (?1, ?2)",
          [order.id, JSON.stringify(order)],
        );
      }
      await database.execute(
        `INSERT INTO settings (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        ["hidden-stock", JSON.stringify(hiddenStockListIds)],
      );
      await database.execute("COMMIT");
    } catch (error) {
      await database.execute("ROLLBACK");
      throw error;
    }
  };

  writeQueue = writeQueue.then(save, save);
  return writeQueue;
}