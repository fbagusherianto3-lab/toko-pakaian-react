import React, { useMemo, useState } from "react";

// =====================================================
// TYPES & INTERFACES
// =====================================================

type UserRole = "Admin" | "Kasir" | "Pelanggan";

type Category =
  | "Semua"
  | "Pria"
  | "Wanita"
  | "Unisex"
  | "Anak-Anak"
  | "Import";

type ProductCategory = Exclude<Category, "Semua">;

type OrderStatus = "Diproses" | "Dikirim" | "Selesai";

interface User {
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

interface CurrentUser {
  username: string;
  role: UserRole;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  sizes: string[];
  image: string;
  stock: number;
}

interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

interface OrderItem {
  id: string;
  date: string;
  username: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
}

// =====================================================
// MOCK USER
// =====================================================

const USERS: User[] = [
  {
    username: "admin",
    password: "123",
    role: "Admin",
    name: "Administrator",
  },
  {
    username: "kasir",
    password: "123",
    role: "Kasir",
    name: "Kasir Utama",
  },
  {
    username: "bagus",
    password: "123",
    role: "Pelanggan",
    name: "Bagus Setiawan",
  },
];

// =====================================================
// INITIAL PRODUCTS
// =====================================================

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kaos Polos Cotton Combed 30s",
    price: 75000,
    category: "Pria",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    stock: 25,
  },
  {
    id: 2,
    name: "Kemeja Flannel Slimfit",
    price: 135000,
    category: "Pria",
    sizes: ["M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
    stock: 18,
  },
  {
    id: 3,
    name: "Oversized Minimalist Hoodie",
    price: 185000,
    category: "Unisex",
    sizes: ["M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    stock: 12,
  },
  {
    id: 4,
    name: "Floral Casual Summer Dress",
    price: 145000,
    category: "Wanita",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    stock: 10,
  },
  {
    id: 5,
    name: "Vintage Denim Jacket",
    price: 220000,
    category: "Unisex",
    sizes: ["M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800",
    stock: 15,
  },
  {
    id: 6,
    name: "Korean Overfit Cardigan",
    price: 245000,
    category: "Import",
    sizes: ["All Size"],
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
    stock: 8,
  },
  {
    id: 7,
    name: "Kaos Anak Ceria",
    price: 55000,
    category: "Anak-Anak",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800",
    stock: 20,
  },
  {
    id: 8,
    name: "Dress Anak Motif Bunga",
    price: 85000,
    category: "Anak perempuan",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800",
    stock: 14,
  },
];

// =====================================================
// CATEGORY
// =====================================================

const CATEGORIES: { name: Category; label: string }[] = [
  {
    name: "Semua",
    label: "✨ Semua Produk",
  },
  {
    name: "Pria",
    label: "👔 Pria",
  },
  {
    name: "Wanita",
    label: "👗 Wanita",
  },
  {
    name: "Unisex",
    label: "🧥 Unisex",
  },
  {
    name: "Import",
    label: "✈️ Import",
  },
  {
    name: "Anak-Anak",
    label: "🧒 Anak-Anak",
  },
];

// =====================================================
// HELPER
// =====================================================

const formatRupiah = (value: number) =>
  `Rp ${value.toLocaleString("id-ID")}`;

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800";

// =====================================================
// MAIN APP
// =====================================================

export default function App() {
  // ===================================================
  // LOGIN
  // ===================================================

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ===================================================
  // PRODUCT & CART
  // ===================================================

  const [productList, setProductList] =
    useState<Product[]>(INITIAL_PRODUCTS);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedSizes, setSelectedSizes] =
    useState<Record<number, string>>({});

  const [selectedCategory, setSelectedCategory] =
    useState<Category>("Semua");

  const [search, setSearch] = useState("");

  // ===================================================
  // STOCK LIST
  // ===================================================

  const [hiddenStockListIds, setHiddenStockListIds] =
    useState<number[]>([]);

  // ===================================================
  // ORDERS
  // ===================================================

  const [orders, setOrders] = useState<OrderItem[]>([]);

  const [paymentMethod, setPaymentMethod] =
    useState("QRIS / e-Wallet");

  const [editingOrderId, setEditingOrderId] =
    useState<string | null>(null);

  // ===================================================
  // MODAL / DRAWER
  // ===================================================

  const [isAddProductOpen, setIsAddProductOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [isOrdersOpen, setIsOrdersOpen] =
    useState(false);

  // ===================================================
  // ADD PRODUCT FORM
  // ===================================================

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Pria" as ProductCategory,
    sizes: "S, M, L, XL",
    image: "",
    stock: "20",
  });

  // ===================================================
  // EDIT PRODUCT FORM
  // ===================================================

  const [editProductForm, setEditProductForm] = useState({
    id: 0,
    name: "",
    price: "",
    category: "Pria" as ProductCategory,
    sizes: "",
    image: "",
    stock: "",
  });

  // ===================================================
  // TOAST
  // ===================================================

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // ===================================================
  // FILTER PRODUCT
  // ===================================================

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return productList.filter((product) => {
      const matchCategory =
        selectedCategory === "Semua" ||
        product.category === selectedCategory;

      const matchSearch =
        keyword === "" ||
        product.name.toLowerCase().includes(keyword);

      return matchCategory && matchSearch;
    });
  }, [productList, selectedCategory, search]);

  // ===================================================
  // TOTAL
  // ===================================================

  const totalCartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalCartPrice = cart.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  const totalProductStock = productList.reduce(
    (total, product) => total + product.stock,
    0
  );

  const totalProductTypes = productList.length;

  const visibleStockProducts = productList.filter(
    (product) => !hiddenStockListIds.includes(product.id)
  );

  // ===================================================
  // LOGIN
  // ===================================================

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    setLoginError("");

    const username =
      loginForm.username.trim().toLowerCase();

    const user = USERS.find(
      (item) =>
        item.username.toLowerCase() === username &&
        item.password === loginForm.password
    );

    if (!user) {
      setLoginError(
        "Username atau password tidak ditemukan!"
      );
      return;
    }

    setCurrentUser({
      username: user.username,
      role: user.role,
      name: user.name,
    });

    setLoginForm({
      username: "",
      password: "",
    });

    setShowPassword(false);
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = USERS.find(
      (item) => item.role === role
    );

    if (!user) return;

    setCurrentUser({
      username: user.username,
      role: user.role,
      name: user.name,
    });

    setLoginError("");
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setSelectedSizes({});
    setIsCartOpen(false);
    setIsOrdersOpen(false);
    setIsAddProductOpen(false);
    setEditingProduct(null);
    setEditingOrderId(null);
    setSearch("");
    setSelectedCategory("Semua");
  };

  // ===================================================
  // SIZE
  // ===================================================

  const selectSize = (
    productId: number,
    size: string
  ) => {
    setSelectedSizes((previous) => ({
      ...previous,
      [productId]: size,
    }));
  };

  // ===================================================
  // ADD TO CART
  // ===================================================

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast("Stok pakaian ini sedang habis!");
      return;
    }

    const selectedSize = selectedSizes[product.id];

    if (!selectedSize) {
      showToast(
        `Pilih ukuran untuk ${product.name} terlebih dahulu!`
      );
      return;
    }

    setCart((previousCart) => {
      const existingIndex = previousCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize
      );

      if (existingIndex !== -1) {
        const updatedCart = [...previousCart];

        const existingItem =
          updatedCart[existingIndex];

        if (
          existingItem.quantity >= product.stock
        ) {
          showToast(
            "Jumlah di keranjang sudah mencapai stok."
          );

          return previousCart;
        }

        updatedCart[existingIndex] = {
          ...existingItem,
          product: { ...product },
          quantity: existingItem.quantity + 1,
        };

        return updatedCart;
      }

      return [
        ...previousCart,
        {
          product: { ...product },
          selectedSize,
          quantity: 1,
        },
      ];
    });
  };

  // ===================================================
  // UPDATE CART QTY
  // ===================================================

  const updateCartQty = (
    productId: number,
    size: string,
    delta: number
  ) => {
    setCart((previousCart) =>
      previousCart
        .map((item) => {
          if (
            item.product.id !== productId ||
            item.selectedSize !== size
          ) {
            return item;
          }

          const latestProduct = productList.find(
            (product) => product.id === productId
          );

          const latestStock =
            latestProduct?.stock ??
            item.product.stock;

          if (
            delta > 0 &&
            item.quantity >= latestStock
          ) {
            showToast(
              "Jumlah melebihi stok yang tersedia."
            );

            return item;
          }

          const nextQuantity = Math.min(
            latestStock,
            item.quantity + delta
          );

          if (nextQuantity <= 0) {
            return null;
          }

          return {
            ...item,
            product: latestProduct
              ? { ...latestProduct }
              : item.product,
            quantity: nextQuantity,
          };
        })
        .filter(
          (item): item is CartItem => item !== null
        )
    );
  };

  // ===================================================
  // REMOVE CART ITEM
  // ===================================================

  const removeCartItem = (
    productId: number,
    size: string
  ) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size
          )
      )
    );

    showToast("Item dihapus dari keranjang!");
  };

  // ===================================================
  // CHECKOUT
  // ===================================================

  const handleCheckout = () => {
    if (!currentUser) {
      showToast("Silakan login terlebih dahulu.");
      return;
    }

    if (cart.length === 0) {
      showToast("Keranjang masih kosong.");
      return;
    }

    // Cek stok terbaru
    for (const item of cart) {
      const latestProduct = productList.find(
        (product) => product.id === item.product.id
      );

      if (!latestProduct) {
        showToast(
          `Produk ${item.product.name} sudah tidak tersedia.`
        );
        return;
      }

      if (latestProduct.stock < item.quantity) {
        showToast(
          `Stok ${item.product.name} tidak mencukupi.`
        );
        return;
      }

      if (
        !latestProduct.sizes.includes(
          item.selectedSize
        )
      ) {
        showToast(
          `Ukuran ${item.selectedSize} untuk ${item.product.name} sudah tidak tersedia.`
        );
        return;
      }
    }

    const orderId = `INV-${Date.now()
      .toString()
      .slice(-6)}`;

    const newOrder: OrderItem = {
      id: orderId,

      date: new Date().toLocaleString(
        "id-ID",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

      username: currentUser.username,

      items: cart.map((item) => ({
        ...item,
        product: { ...item.product },
      })),

      totalPrice: totalCartPrice,

      paymentMethod,

      status: "Diproses",
    };

    // Kurangi stok
    setProductList((previousProducts) =>
      previousProducts.map((product) => {
        const orderedItem = cart.find(
          (item) => item.product.id === product.id
        );

        if (!orderedItem) {
          return product;
        }

        return {
          ...product,
          stock: Math.max(
            0,
            product.stock - orderedItem.quantity
          ),
        };
      })
    );

    setOrders((previousOrders) => [
      newOrder,
      ...previousOrders,
    ]);

    setCart([]);
    setSelectedSizes({});
    setIsCartOpen(false);
    setIsOrdersOpen(true);

    showToast("Pesanan berhasil dibuat!");
  };

  // ===================================================
  // ORDER HANDLERS
  // ===================================================

  const handleDeleteOrder = (
    orderId: string
  ) => {
    setOrders((previousOrders) =>
      previousOrders.filter(
        (order) => order.id !== orderId
      )
    );

    if (editingOrderId === orderId) {
      setEditingOrderId(null);
    }

    showToast(
      `Pesanan ${orderId} berhasil dihapus.`
    );
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: OrderStatus
  ) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order
      )
    );

    setEditingOrderId(null);

    showToast(
      `Status ${orderId} diperbarui menjadi "${status}".`
    );
  };

  // ===================================================
  // HIDE STOCK LIST
  // ===================================================

  const hideFromStockList = (
    productId: number
  ) => {
    setHiddenStockListIds((previousIds) =>
      previousIds.includes(productId)
        ? previousIds
        : [...previousIds, productId]
    );
  };

  // ===================================================
  // RESTORE STOCK LIST
  // ===================================================

  const restoreStockList = () => {
    setHiddenStockListIds([]);
    showToast(
      "Semua produk ditampilkan kembali pada daftar stok."
    );
  };

  // ===================================================
  // ADD STOCK
  // ===================================================

  const handleAddStock = (
    productId: number
  ) => {
    setProductList((previousProducts) =>
      previousProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              stock: product.stock + 5,
            }
          : product
      )
    );

    showToast("+5 stok berhasil ditambahkan!");
  };

  // ===================================================
  // DELETE PRODUCT
  // ===================================================

  const handleDeleteProduct = (
    productId: number
  ) => {
    const product = productList.find(
      (item) => item.id === productId
    );

    if (!product) return;

    const confirmed = window.confirm(
      `Hapus produk "${product.name}" dari katalog?`
    );

    if (!confirmed) return;

    setProductList((previousProducts) =>
      previousProducts.filter(
        (item) => item.id !== productId
      )
    );

    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.product.id !== productId
      )
    );

    setSelectedSizes((previousSizes) => {
      const updated = {
        ...previousSizes,
      };

      delete updated[productId];

      return updated;
    });

    setHiddenStockListIds((previousIds) =>
      previousIds.filter(
        (id) => id !== productId
      )
    );

    if (editingProduct?.id === productId) {
      setEditingProduct(null);
    }

    showToast("Produk berhasil dihapus dari katalog!");
  };

  // ===================================================
  // ADD PRODUCT
  // ===================================================

  const handleAddProductSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const name = newProduct.name.trim();
    const price = Number(newProduct.price);
    const stock = Number(newProduct.stock);

    const sizes = newProduct.sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);

    if (!name) {
      showToast("Nama produk wajib diisi!");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      showToast("Harga produk tidak valid!");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      showToast("Jumlah stok tidak valid!");
      return;
    }

    if (sizes.length === 0) {
      showToast("Minimal masukkan satu ukuran!");
      return;
    }

    const createdProduct: Product = {
      id: Date.now(),
      name,
      price,
      category: newProduct.category,
      sizes,
      image:
        newProduct.image.trim() ||
        DEFAULT_PRODUCT_IMAGE,
      stock,
    };

    setProductList((previousProducts) => [
      createdProduct,
      ...previousProducts,
    ]);

    setIsAddProductOpen(false);

    setNewProduct({
      name: "",
      price: "",
      category: "Pria",
      sizes: "S, M, L, XL",
      image: "",
      stock: "20",
    });

    showToast(
      "🎉 Produk pakaian baru berhasil ditambahkan!"
    );
  };

  // ===================================================
  // OPEN EDIT PRODUCT
  // ===================================================

  const openEditProductModal = (
    product: Product
  ) => {
    setEditingProduct(product);

    setEditProductForm({
      id: product.id,
      name: product.name,
      price: String(product.price),
      category: product.category,
      sizes: product.sizes.join(", "),
      image: product.image,
      stock: String(product.stock),
    });
  };

  // ===================================================
  // EDIT PRODUCT
  // ===================================================

  const handleEditProductSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const name =
      editProductForm.name.trim();

    const price =
      Number(editProductForm.price);

    const stock =
      Number(editProductForm.stock);

    const sizes =
      editProductForm.sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

    if (!name) {
      showToast("Nama produk wajib diisi!");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      showToast("Harga produk tidak valid!");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      showToast("Jumlah stok tidak valid!");
      return;
    }

    if (sizes.length === 0) {
      showToast("Minimal masukkan satu ukuran!");
      return;
    }

    setProductList((previousProducts) =>
      previousProducts.map((product) => {
        if (
          product.id !==
          editProductForm.id
        ) {
          return product;
        }

        return {
          ...product,
          name,
          price,
          category:
            editProductForm.category,
          sizes,
          image:
            editProductForm.image.trim() ||
            product.image,
          stock,
        };
      })
    );

    // Sinkronisasi item keranjang
    setCart((previousCart) =>
      previousCart
        .map((item) => {
          if (
            item.product.id !==
            editProductForm.id
          ) {
            return item;
          }

          if (
            !sizes.includes(
              item.selectedSize
            )
          ) {
            return null;
          }

          return {
            ...item,
            product: {
              ...item.product,
              name,
              price,
              category:
                editProductForm.category,
              sizes,
              image:
                editProductForm.image.trim() ||
                item.product.image,
              stock,
            },
            quantity: Math.min(
              item.quantity,
              stock
            ),
          };
        })
        .filter(
          (item): item is CartItem =>
            item !== null &&
            item.quantity > 0
        )
    );

    setEditingProduct(null);

    showToast(
      "✏️ Produk berhasil diperbarui!"
    );
  };

  // ===================================================
  // LOGIN PAGE
  // ===================================================

  if (!currentUser) {
    return (
      <div className="login-wrapper">
        <style>{`
          * {
            box-sizing: border-box;
            font-family:
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          body {
            margin: 0;
          }

          .login-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(
                circle at top left,
                #1e3a8a,
                transparent 40%
              ),
              #020617;
            padding: 20px;
            color: #f8fafc;
          }

          .login-box {
            width: 100%;
            max-width: 850px;
            background: #1e293b;
            border-radius: 22px;
            overflow: hidden;
            display: grid;
            grid-template-columns: 1fr 1fr;
            border: 1px solid #334155;
            box-shadow:
              0 25px 70px rgba(0,0,0,.4);
          }

          .login-hero {
            background:
              linear-gradient(
                135deg,
                #2563eb,
                #4f46e5
              );
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 500px;
          }

          .login-form {
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            font-size: 13px;
            margin-bottom: 6px;
            color: #cbd5e1;
            font-weight: 700;
          }

          .input-field {
            width: 100%;
            height: 46px;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 10px;
            padding: 0 14px;
            color: #fff;
            outline: none;
          }

          .input-field:focus {
            border-color: #3b82f6;
            box-shadow:
              0 0 0 3px
              rgba(59,130,246,.15);
          }

          .btn-primary {
            width: 100%;
            height: 46px;
            background: #3b82f6;
            color: #fff;
            font-weight: 700;
            border: 0;
            border-radius: 10px;
            cursor: pointer;
          }

          .btn-primary:hover {
            background: #2563eb;
          }

          .quick-btns {
            display: flex;
            gap: 8px;
            margin-top: 16px;
          }

          .quick-btn {
            flex: 1;
            padding: 9px;
            background: #334155;
            border: 0;
            border-radius: 8px;
            color: #cbd5e1;
            font-size: 12px;
            cursor: pointer;
          }

          .quick-btn:hover {
            background: #475569;
            color: #fff;
          }

          @media (max-width: 640px) {
            .login-box {
              grid-template-columns: 1fr;
            }

            .login-hero {
              display: none;
            }

            .login-form {
              padding: 28px 22px;
            }

            .quick-btns {
              flex-direction: column;
            }
          }
        `}</style>

        <div className="login-box">
          <div className="login-hero">
            <div>
              <div
                style={{
                  fontSize: "54px",
                  marginBottom: "18px",
                }}
              >
                👕
              </div>

              <h1
                style={{
                  fontSize: "30px",
                  margin: "0 0 12px",
                }}
              >
                tokoh baju milik bagus & tasya
              </h1>

              <p
                style={{
                  lineHeight: "1.7",
                  color: "#e0e7ff",
                  margin: 0,
                }}
              >
                Platform belanja pakaian
                modern terlengkap.
              </p>
            </div>

            <div
              style={{
                fontSize: "12px",
                opacity: 0.8,
              }}
            >
              Demo password:
              <b> 123</b>
            </div>
          </div>

          <div className="login-form">
            <h2
              style={{
                margin: "0 0 8px",
              }}
            >
              Selamat Datang di tokoh pakaian kami👋
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                margin:
                  "0 0 24px",
              }}
            >
              Silakan masuk ke akun Anda
            </p>

            {loginError && (
              <div
                style={{
                  color: "#f87171",
                  background:
                    "rgba(239,68,68,.08)",
                  border:
                    "1px solid rgba(239,68,68,.2)",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  marginBottom: "14px",
                  fontSize: "13px",
                }}
              >
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>
                  Username
                </label>

                <input
                  className="input-field"
                  placeholder="admin / kasir / bagus"
                  value={
                    loginForm.username
                  }
                  onChange={(event) =>
                    setLoginForm({
                      ...loginForm,
                      username:
                        event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Password
                </label>

                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    className="input-field"
                    placeholder="Password"
                    value={
                      loginForm.password
                    }
                    onChange={(event) =>
                      setLoginForm({
                        ...loginForm,
                        password:
                          event.target.value,
                      })
                    }
                    required
                    style={{
                      paddingRight:
                        "85px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    style={{
                      position:
                        "absolute",
                      right: "8px",
                      top: "6px",
                      height: "34px",
                      border: "none",
                      background:
                        "transparent",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {showPassword
                      ? "Sembunyikan"
                      : "Lihat"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
              >
                Masuk Sekarang
              </button>
            </form>

            <div
              style={{
                marginTop: "20px",
                color: "#64748b",
                fontSize: "11px",
                textAlign: "center",
              }}
            >
              Login cepat
            </div>

            <div className="quick-btns">
              <button
                type="button"
                className="quick-btn"
                onClick={() =>
                  handleQuickLogin("Admin")
                }
              >
                👑 Admin
              </button>

              <button
                type="button"
                className="quick-btn"
                onClick={() =>
                  handleQuickLogin("Kasir")
                }
              >
                🏬 Kasir
              </button>

              <button
                type="button"
                className="quick-btn"
                onClick={() =>
                  handleQuickLogin(
                    "Pelanggan"
                  )
                }
              >
                👤 Pelanggan
              </button>
            </div>

            <div
              style={{
                marginTop: "16px",
                fontSize: "11px",
                color: "#64748b",
                textAlign: "center",
              }}
            >
              Admin: admin / 123
              <br />
              Kasir: kasir / 123
              <br />
              Pelanggan: bagus / 123
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // MAIN PAGE
  // ===================================================

  return (
    <div className="app-container">
      <style>{`
        * {
          box-sizing: border-box;
          font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        body {
          margin: 0;
          background: #f8fafc;
          color: #0f172a;
        }

        button,
        input,
        select {
          font-family: inherit;
        }

        button {
          transition:
            transform .15s ease,
            opacity .15s ease,
            background .15s ease;
        }

        button:active {
          transform: scale(.98);
        }

        .header-bar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #0f172a;
          color: #fff;
          padding: 14px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .action-btn {
          background: #1e293b;
          color: #fff;
          border: 1px solid #334155;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .action-btn:hover {
          opacity: .9;
        }

        .action-btn.primary {
          background: #3b82f6;
          border-color: #3b82f6;
        }

        .action-btn.success {
          background: #16a34a;
          border-color: #16a34a;
        }

        .layout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px 50px;
        }

        .catalog-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .search-input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          width: 240px;
          outline: none;
          background: #fff;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow:
            0 0 0 3px
            rgba(59,130,246,.1);
        }

        .stock-summary {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .stock-summary-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 16px;
        }

        .stock-summary-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .stock-summary-value {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .category-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 24px;
        }

        .cat-chip {
          padding: 8px 16px;
          border-radius: 20px;
          background: #fff;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          white-space: nowrap;
        }

        .cat-chip:hover {
          border-color: #94a3b8;
        }

        .cat-chip.active {
          background: #0f172a;
          color: #fff;
          border-color: #0f172a;
        }

        .product-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fill,
              minmax(240px, 1fr)
            );
          gap: 20px;
        }

        .product-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          box-shadow:
            0 10px 30px
            rgba(15,23,42,.08);
        }

        .product-img-wrap {
          position: relative;
          width: 100%;
          height: 220px;
          background: #f1f5f9;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .size-text {
          background: transparent;
          border: none;
          padding: 2px 6px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
        }

        .size-text:hover {
          color: #3b82f6;
        }

        .size-text.selected {
          color: #3b82f6;
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .drawer-overlay {
          position: fixed;
          inset: 0;
          background:
            rgba(15,23,42,.6);
          z-index: 300;
        }

        .drawer-content {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(420px, 100%);
          background: #fff;
          z-index: 301;
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow:
            -4px 0 24px
            rgba(0,0,0,.15);
        }

        .modal-box {
          position: fixed;
          top: 50%;
          left: 50%;
          transform:
            translate(-50%, -50%);
          width: min(500px, 92%);
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          z-index: 301;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow:
            0 20px 60px
            rgba(0,0,0,.2);
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          margin-top: 4px;
          margin-bottom: 12px;
          outline: none;
          background: #fff;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow:
            0 0 0 3px
            rgba(59,130,246,.1);
        }

        .qty-text-btn {
          background: transparent;
          border: none;
          font-size: 16px;
          font-weight: 800;
          color: #475569;
          cursor: pointer;
          padding: 2px 8px;
        }

        .qty-text-btn:hover {
          color: #3b82f6;
        }

        .order-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 2px 6px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 4px;
        }

        .order-btn:hover {
          background: #f1f5f9;
        }

        .close-btn {
          border: none;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
          color: #64748b;
        }

        .close-btn:hover {
          color: #ef4444;
        }

        .toast-banner {
          position: fixed;
          top: 80px;
          right: 24px;
          z-index: 500;
          background: #0f172a;
          color: #fff;
          padding: 12px 20px;
          border-radius: 10px;
          border-left: 4px solid #3b82f6;
          box-shadow:
            0 10px 30px
            rgba(0,0,0,.2);
          max-width: 360px;
          font-size: 13px;
        }

        .stock-list-row {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            auto
            minmax(120px, auto);
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }

        @media (max-width: 760px) {
          .header-bar {
            flex-wrap: wrap;
          }

          .header-actions {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 3px;
          }

          .catalog-head {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input {
            width: 100%;
          }

          .product-grid {
            grid-template-columns:
              repeat(
                auto-fill,
                minmax(180px, 1fr)
              );
            gap: 12px;
          }

          .product-img-wrap {
            height: 190px;
          }

          .stock-list-row {
            grid-template-columns:
              1fr auto;
          }

          .stock-list-actions {
            grid-column: 1 / -1;
            justify-content: flex-start !important;
          }
        }

        @media (max-width: 500px) {
          .stock-summary {
            grid-template-columns: 1fr;
          }

          .header-bar {
            padding: 12px 14px;
          }

          .layout-container {
            padding:
              18px 12px 40px;
          }

          .product-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .product-img-wrap {
            height: 160px;
          }

          .product-card h4 {
            font-size: 13px !important;
          }

          .toast-banner {
            right: 12px;
            left: 12px;
            max-width: none;
          }
        }
      `}</style>

      {/* =================================================
          TOAST
      ================================================= */}

      {toastMessage && (
        <div className="toast-banner">
          {toastMessage}
        </div>
      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header-bar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "800",
              whiteSpace: "nowrap",
            }}
          >
            👕 CLOTHING STORE
          </span>

          <span
            style={{
              background: "#334155",
              color: "#cbd5e1",
              padding: "3px 9px",
              borderRadius: "12px",
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          >
            {currentUser.role}
          </span>
        </div>

        <div
          className="header-actions"
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {currentUser.role !==
            "Pelanggan" && (
            <button
              className="action-btn success"
              onClick={() =>
                setIsAddProductOpen(true)
              }
            >
              ➕ Tambah Produk
            </button>
          )}

          <button
            className="action-btn primary"
            onClick={() =>
              setIsCartOpen(true)
            }
          >
            🛒 Keranjang (
            {totalCartCount})
          </button>

          <button
            className="action-btn"
            onClick={() =>
              setIsOrdersOpen(true)
            }
          >
            📦 Pesanan ({orders.length})
          </button>

          <button
            className="action-btn"
            style={{
              background: "#ef4444",
              borderColor: "#ef4444",
            }}
            onClick={handleLogout}
          >
            Keluar
          </button>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="layout-container">
        {/* CATALOG HEADER */}

        <div className="catalog-head">
          <div>
            <h2
              style={{
                margin: 0,
              }}
            >
              Katalog Pakaian
            </h2>

            <p
              style={{
                color: "#64748b",
                margin: 0,
                fontSize: "14px",
              }}
            >
              Halo{" "}
              <b>
                {currentUser.name}
              </b>
              , temukan gaya berpakaian
              terbaikmu.
            </p>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder="Cari pakaian..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="stock-summary">
          <div className="stock-summary-card">
            <div className="stock-summary-label">
              📦 Jenis Produk
            </div>

            <div className="stock-summary-value">
              {totalProductTypes}
            </div>
          </div>

          <div className="stock-summary-card">
            <div className="stock-summary-label">
              📊 Total Semua Stok
            </div>

            <div className="stock-summary-value">
              {totalProductStock} pcs
            </div>
          </div>
        </div>

        {/* =================================================
            STOCK LIST
        ================================================= */}

        <div
          style={{
            background: "#fff",
            border:
              "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                }}
              >
                📋 Stok Semua Barang
              </h3>

              <p
                style={{
                  margin:
                    "4px 0 0",
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                Lihat stok setiap produk
                sekaligus.
              </p>

              <p
                style={{
                  margin:
                    "4px 0 0",
                  color: "#94a3b8",
                  fontSize: "11px",
                }}
              >
                ℹ️ Hapus/X di sini hanya
                menyembunyikan barang dari
                daftar stok.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {hiddenStockListIds.length >
                0 && (
                <button
                  onClick={
                    restoreStockList
                  }
                  style={{
                    border: 0,
                    background:
                      "#e2e8f0",
                    color: "#0f172a",
                    padding:
                      "5px 10px",
                    borderRadius:
                      "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor:
                      "pointer",
                  }}
                >
                  ↻ Tampilkan Semua
                </button>
              )}

              <span
                style={{
                  background:
                    "#eff6ff",
                  color: "#2563eb",
                  padding:
                    "5px 10px",
                  borderRadius:
                    "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Total:{" "}
                {totalProductStock} pcs
              </span>
            </div>
          </div>

          {visibleStockProducts.length ===
          0 ? (
            <div
              style={{
                padding: "20px",
                textAlign:
                  "center",
                color: "#64748b",
                background:
                  "#f8fafc",
                borderRadius: "8px",
                border:
                  "1px dashed #cbd5e1",
              }}
            >
              Semua barang sudah
              disembunyikan dari daftar
              stok.

              <br />

              <span
                style={{
                  fontSize: "11px",
                }}
              >
                Produk tetap tersedia
                di katalog.
              </span>

              <br />

              <button
                onClick={
                  restoreStockList
                }
                style={{
                  marginTop:
                    "10px",
                  border: 0,
                  background:
                    "#3b82f6",
                  color: "#fff",
                  padding:
                    "7px 12px",
                  borderRadius:
                    "7px",
                  cursor:
                    "pointer",
                  fontWeight:
                    700,
                  fontSize:
                    "12px",
                }}
              >
                Tampilkan Semua
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "7px",
              }}
            >
              {visibleStockProducts.map(
                (product) => (
                  <div
                    key={`stock-${product.id}`}
                    className="stock-list-row"
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontWeight:
                            "700",
                          fontSize:
                            "13px",
                          whiteSpace:
                            "nowrap",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {product.name}
                      </div>

                      <div
                        style={{
                          color:
                            "#94a3b8",
                          fontSize:
                            "11px",
                        }}
                      >
                        {
                          product.category
                        }
                      </div>
                    </div>

                    <span
                      style={{
                        fontWeight:
                          "800",
                        fontSize:
                          "13px",
                        color:
                          product.stock >
                          0
                            ? "#15803d"
                            : "#dc2626",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {product.stock}{" "}
                      pcs
                    </span>

                    {currentUser.role !==
                      "Pelanggan" && (
                      <div
                        className="stock-list-actions"
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "4px",
                          flexWrap:
                            "wrap",
                          justifyContent:
                            "flex-end",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleAddStock(
                              product.id
                            )
                          }
                          style={{
                            border: 0,
                            background:
                              "#334155",
                            color:
                              "#fff",
                            borderRadius:
                              "6px",
                            padding:
                              "5px 8px",
                            fontSize:
                              "11px",
                            fontWeight:
                              "700",
                            cursor:
                              "pointer",
                          }}
                        >
                          +5 Stok
                        </button>

                        <button
                          onClick={() =>
                            openEditProductModal(
                              product
                            )
                          }
                          style={{
                            border: 0,
                            background:
                              "#2563eb",
                            color:
                              "#fff",
                            borderRadius:
                              "6px",
                            padding:
                              "5px 8px",
                            fontSize:
                              "11px",
                            fontWeight:
                              "700",
                            cursor:
                              "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            hideFromStockList(
                              product.id
                            )
                          }
                          style={{
                            border: 0,
                            background:
                              "#ef4444",
                            color:
                              "#fff",
                            borderRadius:
                              "6px",
                            padding:
                              "5px 8px",
                            fontSize:
                              "11px",
                            fontWeight:
                              "700",
                            cursor:
                              "pointer",
                          }}
                        >
                          🗑️ Hapus
                        </button>

                        <button
                          onClick={() =>
                            hideFromStockList(
                              product.id
                            )
                          }
                          style={{
                            border: 0,
                            background:
                              "transparent",
                            color:
                              "#ef4444",
                            borderRadius:
                              "50%",
                            width:
                              "25px",
                            height:
                              "25px",
                            fontSize:
                              "14px",
                            fontWeight:
                              "900",
                            cursor:
                              "pointer",
                          }}
                          title="Sembunyikan dari daftar stok"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* =================================================
            CATEGORY
        ================================================= */}

        <div className="category-scroll">
          {CATEGORIES.map(
            (category) => (
              <button
                key={
                  category.name
                }
                className={`cat-chip ${
                  selectedCategory ===
                  category.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    category.name
                  )
                }
              >
                {category.label}
              </button>
            )
          )}
        </div>

        {/* =================================================
            PRODUCT
        ================================================= */}

        {filteredProducts.length ===
        0 ? (
          <div
            style={{
              background: "#fff",
              border:
                "1px solid #e2e8f0",
              borderRadius: "16px",
              padding:
                "48px 20px",
              textAlign:
                "center",
              color: "#64748b",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom:
                  "10px",
              }}
            >
              🔎
            </div>

            <h3
              style={{
                margin:
                  "0 0 6px",
                color:
                  "#0f172a",
              }}
            >
              Produk tidak ditemukan
            </h3>

            <p
              style={{
                margin: 0,
              }}
            >
              Coba gunakan kata kunci
              atau kategori yang
              berbeda.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(
              (product) => {
                const selectedSize =
                  selectedSizes[
                    product.id
                  ];

                return (
                  <div
                    key={
                      product.id
                    }
                    className="product-card"
                  >
                    {/* IMAGE */}

                    <div className="product-img-wrap">
                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        className="product-img"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.src =
                            DEFAULT_PRODUCT_IMAGE;
                        }}
                      />

                      <span
                        style={{
                          position:
                            "absolute",
                          bottom: 8,
                          left: 8,
                          background:
                            product.stock >
                            0
                              ? "#16a34a"
                              : "#ef4444",
                          color:
                            "#fff",
                          fontSize:
                            "10px",
                          padding:
                            "3px 7px",
                          borderRadius:
                            "4px",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {product.stock >
                        0
                          ? `Stok: ${product.stock}`
                          : "Habis"}
                      </span>

                      {currentUser.role !==
                        "Pelanggan" && (
                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              product.id
                            )
                          }
                          style={{
                            position:
                              "absolute",
                            top: 8,
                            right: 8,
                            background:
                              "rgba(239,68,68,.9)",
                            color:
                              "#fff",
                            border:
                              "none",
                            borderRadius:
                              "50%",
                            width:
                              "26px",
                            height:
                              "26px",
                            cursor:
                              "pointer",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize:
                              "12px",
                            fontWeight:
                              "bold",
                          }}
                          title="Hapus Produk"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* PRODUCT CONTENT */}

                    <div
                      style={{
                        padding:
                          "16px",
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            "11px",
                          color:
                            "#3b82f6",
                          fontWeight:
                            "700",
                        }}
                      >
                        {
                          product.category
                        }
                      </span>

                      <h4
                        style={{
                          margin:
                            "4px 0 8px",
                          fontSize:
                            "15px",
                        }}
                      >
                        {
                          product.name
                        }
                      </h4>

                      <div
                        style={{
                          fontWeight:
                            "700",
                          fontSize:
                            "16px",
                          marginBottom:
                            "12px",
                        }}
                      >
                        {formatRupiah(
                          product.price
                        )}
                      </div>

                      {/* SIZE */}

                      <div
                        style={{
                          marginBottom:
                            "12px",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "8px",
                            alignItems:
                              "center",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize:
                                "11px",
                              color:
                                "#94a3b8",
                            }}
                          >
                            Ukuran:
                          </span>

                          {product.sizes.map(
                            (size) => (
                              <button
                                key={
                                  size
                                }
                                className={`size-text ${
                                  selectedSize ===
                                  size
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  selectSize(
                                    product.id,
                                    size
                                  )
                                }
                              >
                                {size}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* ADMIN/KASIR */}

                      {currentUser.role !==
                        "Pelanggan" && (
                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "4px",
                            marginBottom:
                              "8px",
                          }}
                        >
                          <button
                            style={{
                              flex: 1,
                              padding:
                                "5px",
                              background:
                                "#e2e8f0",
                              color:
                                "#0f172a",
                              border: 0,
                              borderRadius:
                                "4px",
                              fontSize:
                                "11px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "bold",
                            }}
                            onClick={() =>
                              openEditProductModal(
                                product
                              )
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            style={{
                              flex: 1,
                              padding:
                                "5px",
                              background:
                                "#334155",
                              color:
                                "#fff",
                              border: 0,
                              borderRadius:
                                "4px",
                              fontSize:
                                "11px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "700",
                            }}
                            onClick={() =>
                              handleAddStock(
                                product.id
                              )
                            }
                          >
                            +5 Stok
                          </button>

                          <button
                            style={{
                              padding:
                                "5px 8px",
                              background:
                                "#ef4444",
                              color:
                                "#fff",
                              border: 0,
                              borderRadius:
                                "4px",
                              fontSize:
                                "11px",
                              cursor:
                                "pointer",
                            }}
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
                          >
                            🗑️
                          </button>
                        </div>
                      )}

                      {/* ADD CART */}

                      <button
                        className="action-btn primary"
                        style={{
                          marginTop:
                            "auto",
                          justifyContent:
                            "center",
                          opacity:
                            product.stock <=
                            0
                              ? 0.6
                              : 1,
                        }}
                        disabled={
                          product.stock <=
                          0
                        }
                        onClick={() =>
                          addToCart(
                            product
                          )
                        }
                      >
                        {product.stock >
                        0
                          ? "+ Tambah Ke Keranjang"
                          : "Stok Habis"}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </main>

      {/* =================================================
          CART DRAWER
      ================================================= */}

      {isCartOpen && (
        <>
          <div
            className="drawer-overlay"
            onClick={() =>
              setIsCartOpen(false)
            }
          />

          <div className="drawer-content">
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "20px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                }}
              >
                🛒 Keranjang Belanja (
                {totalCartCount})
              </h3>

              <button
                className="close-btn"
                onClick={() =>
                  setIsCartOpen(false)
                }
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div
                style={{
                  textAlign:
                    "center",
                  color:
                    "#94a3b8",
                  marginTop:
                    "40px",
                }}
              >
                <p
                  style={{
                    fontSize:
                      "40px",
                    margin: 0,
                  }}
                >
                  🛍️
                </p>

                <p>
                  Keranjang belanja
                  Anda masih kosong.
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    flex: 1,
                    overflowY:
                      "auto",
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap:
                      "12px",
                    paddingRight:
                      "4px",
                  }}
                >
                  {cart.map(
                    (item) => (
                      <div
                        key={`${item.product.id}-${item.selectedSize}`}
                        style={{
                          display:
                            "flex",
                          gap:
                            "12px",
                          borderBottom:
                            "1px solid #f1f5f9",
                          paddingBottom:
                            "12px",
                        }}
                      >
                        <img
                          src={
                            item.product
                              .image
                          }
                          alt={
                            item.product
                              .name
                          }
                          style={{
                            width:
                              "60px",
                            height:
                              "60px",
                            borderRadius:
                              "8px",
                            objectFit:
                              "cover",
                          }}
                        />

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "flex-start",
                            }}
                          >
                            <h5
                              style={{
                                margin:
                                  "0 0 4px",
                                fontSize:
                                  "14px",
                              }}
                            >
                              {
                                item
                                  .product
                                  .name
                              }
                            </h5>

                            <button
                              className="close-btn"
                              style={{
                                fontSize:
                                  "14px",
                              }}
                              onClick={() =>
                                removeCartItem(
                                  item
                                    .product
                                    .id,
                                  item.selectedSize
                                )
                              }
                            >
                              ✕
                            </button>
                          </div>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#64748b",
                              marginBottom:
                                "6px",
                            }}
                          >
                            Ukuran:{" "}
                            <b>
                              {
                                item.selectedSize
                              }
                            </b>{" "}
                            |{" "}
                            {formatRupiah(
                              item
                                .product
                                .price
                            )}
                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap:
                                "6px",
                            }}
                          >
                            <button
                              className="qty-text-btn"
                              onClick={() =>
                                updateCartQty(
                                  item
                                    .product
                                    .id,
                                  item.selectedSize,
                                  -1
                                )
                              }
                            >
                              -
                            </button>

                            <span
                              style={{
                                fontSize:
                                  "13px",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              className="qty-text-btn"
                              onClick={() =>
                                updateCartQty(
                                  item
                                    .product
                                    .id,
                                  item.selectedSize,
                                  1
                                )
                              }
                            >
                              +
                            </button>

                            <button
                              style={{
                                border: 0,
                                background:
                                  "none",
                                color:
                                  "#ef4444",
                                fontSize:
                                  "12px",
                                cursor:
                                  "pointer",
                                marginLeft:
                                  "auto",
                              }}
                              onClick={() =>
                                removeCartItem(
                                  item
                                    .product
                                    .id,
                                  item.selectedSize
                                )
                              }
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* PAYMENT */}

                <div
                  style={{
                    borderTop:
                      "1px solid #e2e8f0",
                    paddingTop:
                      "16px",
                    marginTop:
                      "16px",
                  }}
                >
                  <label
                    style={{
                      fontSize:
                        "12px",
                      fontWeight:
                        "bold",
                      display:
                        "block",
                      marginBottom:
                        "6px",
                    }}
                  >
                    Metode Pembayaran
                  </label>

                  <select
                    className="form-input"
                    value={
                      paymentMethod
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentMethod(
                        event
                          .target
                          .value
                      )
                    }
                  >
                    <option value="QRIS / e-Wallet">
                      QRIS / e-Wallet
                    </option>

                    <option value="Transfer Bank">
                      Transfer Bank
                    </option>

                    <option value="Tunai / Kasir">
                      Tunai (Bayar di
                      Kasir)
                    </option>
                  </select>

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      margin:
                        "12px 0",
                      fontWeight:
                        "bold",
                      fontSize:
                        "16px",
                    }}
                  >
                    <span>
                      Total Tagihan:
                    </span>

                    <span
                      style={{
                        color:
                          "#3b82f6",
                      }}
                    >
                      {formatRupiah(
                        totalCartPrice
                      )}
                    </span>
                  </div>

                  <button
                    className="action-btn success"
                    style={{
                      width:
                        "100%",
                      padding:
                        "12px",
                      justifyContent:
                        "center",
                      fontSize:
                        "14px",
                    }}
                    onClick={
                      handleCheckout
                    }
                  >
                    Checkout Sekarang
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* =================================================
          ORDERS MODAL
      ================================================= */}

      {isOrdersOpen && (
        <>
          <div
            className="drawer-overlay"
            onClick={() =>
              setIsOrdersOpen(false)
            }
          />

          <div className="modal-box">
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                }}
              >
                📦 Riwayat Pesanan
              </h3>

              <button
                className="close-btn"
                onClick={() =>
                  setIsOrdersOpen(false)
                }
              >
                ✕
              </button>
            </div>

            {orders.length === 0 ? (
              <p
                style={{
                  color:
                    "#64748b",
                  textAlign:
                    "center",
                }}
              >
                Belum ada pesanan yang
                dibuat.
              </p>
            ) : (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap:
                    "12px",
                }}
              >
                {orders.map(
                  (order) => (
                    <div
                      key={
                        order.id
                      }
                      style={{
                        border:
                          "1px solid #e2e8f0",
                        borderRadius:
                          "10px",
                        padding:
                          "12px",
                      }}
                    >
                      {/* ORDER HEADER */}

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap:
                            "8px",
                          fontSize:
                            "12px",
                          color:
                            "#64748b",
                          marginBottom:
                            "8px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <span>
                          <b>
                            {
                              order.id
                            }
                          </b>{" "}
                          |{" "}
                          {
                            order.date
                          }
                        </span>

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap:
                              "6px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <span
                            style={{
                              background:
                                order.status ===
                                "Selesai"
                                  ? "#dcfce7"
                                  : order.status ===
                                    "Dikirim"
                                  ? "#dbeafe"
                                  : "#fef3c7",
                              color:
                                order.status ===
                                "Selesai"
                                  ? "#15803d"
                                  : order.status ===
                                    "Dikirim"
                                  ? "#2563eb"
                                  : "#b45309",
                              padding:
                                "2px 6px",
                              borderRadius:
                                "4px",
                              fontWeight:
                                "bold",
                              fontSize:
                                "11px",
                            }}
                          >
                            {
                              order.status
                            }
                          </span>

                          {currentUser.role !==
                            "Pelanggan" && (
                            <>
                              <button
                                className="order-btn"
                                title="Edit Status"
                                onClick={() =>
                                  setEditingOrderId(
                                    editingOrderId ===
                                      order.id
                                      ? null
                                      : order.id
                                  )
                                }
                                style={{
                                  color:
                                    "#3b82f6",
                                }}
                              >
                                ✏️ Edit
                              </button>

                              <button
                                className="order-btn"
                                title="Hapus Pesanan"
                                onClick={() =>
                                  handleDeleteOrder(
                                    order.id
                                  )
                                }
                                style={{
                                  color:
                                    "#ef4444",
                                }}
                              >
                                🗑️ Hapus
                              </button>
                            </>
                          )}

                          <button
                            className="close-btn"
                            title="Hapus Pesanan"
                            onClick={() =>
                              handleDeleteOrder(
                                order.id
                              )
                            }
                            style={{
                              fontSize:
                                "14px",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* EDIT STATUS */}

                      {editingOrderId ===
                        order.id &&
                        currentUser.role !==
                          "Pelanggan" && (
                          <div
                            style={{
                              background:
                                "#f8fafc",
                              padding:
                                "8px",
                              borderRadius:
                                "6px",
                              marginBottom:
                                "8px",
                              border:
                                "1px solid #cbd5e1",
                            }}
                          >
                            <span
                              style={{
                                fontSize:
                                  "11px",
                                fontWeight:
                                  "bold",
                                display:
                                  "block",
                                marginBottom:
                                  "4px",
                              }}
                            >
                              Ubah Status
                              Pesanan:
                            </span>

                            <div
                              style={{
                                display:
                                  "flex",
                                gap:
                                  "4px",
                              }}
                            >
                              {(
                                [
                                  "Diproses",
                                  "Dikirim",
                                  "Selesai",
                                ] as OrderStatus[]
                              ).map(
                                (
                                  status
                                ) => (
                                  <button
                                    key={
                                      status
                                    }
                                    style={{
                                      flex: 1,
                                      padding:
                                        "5px",
                                      fontSize:
                                        "11px",
                                      borderRadius:
                                        "4px",
                                      border:
                                        "1px solid #cbd5e1",
                                      background:
                                        order.status ===
                                        status
                                          ? "#0f172a"
                                          : "#fff",
                                      color:
                                        order.status ===
                                        status
                                          ? "#fff"
                                          : "#0f172a",
                                      cursor:
                                        "pointer",
                                    }}
                                    onClick={() =>
                                      handleUpdateOrderStatus(
                                        order.id,
                                        status
                                      )
                                    }
                                  >
                                    {
                                      status
                                    }
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* ORDER ITEMS */}

                      {order.items.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={
                              `${order.id}-${index}`
                            }
                            style={{
                              fontSize:
                                "13px",
                              margin:
                                "2px 0",
                            }}
                          >
                            •{" "}
                            {
                              item
                                .product
                                .name
                            }{" "}
                            (
                            {
                              item.selectedSize
                            }
                            ){" "}
                            x
                            {
                              item.quantity
                            }
                          </div>
                        )
                      )}

                      <div
                        style={{
                          borderTop:
                            "1px dashed #e2e8f0",
                          marginTop:
                            "8px",
                          paddingTop:
                            "6px",
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          gap:
                            "10px",
                          fontSize:
                            "13px",
                          fontWeight:
                            "bold",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <span>
                          Total (
                          {
                            order.paymentMethod
                          }
                          ):
                        </span>

                        <span>
                          {formatRupiah(
                            order.totalPrice
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* =================================================
          EDIT PRODUCT MODAL
      ================================================= */}

      {editingProduct && (
        <>
          <div
            className="drawer-overlay"
            onClick={() =>
              setEditingProduct(null)
            }
          />

          <div className="modal-box">
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                }}
              >
                ✏️ Edit Produk Pakaian
              </h3>

              <button
                className="close-btn"
                onClick={() =>
                  setEditingProduct(null)
                }
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                handleEditProductSubmit
              }
            >
              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Nama Produk
              </label>

              <input
                className="form-input"
                value={
                  editProductForm.name
                }
                onChange={(
                  event
                ) =>
                  setEditProductForm(
                    {
                      ...editProductForm,
                      name:
                        event
                          .target
                          .value,
                    }
                  )
                }
                required
              />

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Harga (Rp)
              </label>

              <input
                className="form-input"
                type="number"
                min="0"
                value={
                  editProductForm.price
                }
                onChange={(
                  event
                ) =>
                  setEditProductForm(
                    {
                      ...editProductForm,
                      price:
                        event
                          .target
                          .value,
                    }
                  )
                }
                required
              />

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Kategori
              </label>

              <select
                className="form-input"
                value={
                  editProductForm.category
                }
                onChange={(
                  event
                ) =>
                  setEditProductForm(
                    {
                      ...editProductForm,
                      category:
                        event
                          .target
                          .value as ProductCategory,
                    }
                  )
                }
              >
                {CATEGORIES.filter(
                  (category) =>
                    category.name !==
                    "Semua"
                ).map(
                  (category) => (
                    <option
                      key={
                        category.name
                      }
                      value={
                        category.name
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
              </select>

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Ukuran
              </label>

              <input
                className="form-input"
                placeholder="S, M, L, XL"
                value={
                  editProductForm.sizes
                }
                onChange={(
                  event
                ) =>
                  setEditProductForm(
                    {
                      ...editProductForm,
                      sizes:
                        event
                          .target
                          .value,
                    }
                  )
                }
              />

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Jumlah Stok
              </label>

              <input
                className="form-input"
                type="number"
                min="0"
                value={
                  editProductForm.stock
                }
                onChange={(
                  event
                ) =>
                  setEditProductForm(
                    {
                      ...editProductForm,
                      stock:
                        event
                          .target
                          .value,
                    }
                  )
                }
              />

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                URL Gambar
              </label>

              <input
                className="form-input"
                value={
                  editProductForm.image
                }
                onChange={(
                  event
                ) =>
                  setEditProductForm(
                    {
                      ...editProductForm,
                      image:
                        event
                          .target
                          .value,
                    }
                  )
                }
              />

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "8px",
                  marginTop:
                    "12px",
                }}
              >
                <button
                  type="button"
                  className="action-btn"
                  style={{
                    flex: 1,
                  }}
                  onClick={() =>
                    setEditingProduct(
                      null
                    )
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="action-btn primary"
                  style={{
                    flex: 1,
                  }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* =================================================
          ADD PRODUCT MODAL
      ================================================= */}

      {isAddProductOpen && (
        <>
          <div
            className="drawer-overlay"
            onClick={() =>
              setIsAddProductOpen(
                false
              )
            }
          />

          <div className="modal-box">
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                }}
              >
                ➕ Tambah Produk Pakaian
              </h3>

              <button
                className="close-btn"
                onClick={() =>
                  setIsAddProductOpen(
                    false
                  )
                }
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                handleAddProductSubmit
              }
            >
              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Nama Produk
              </label>

              <input
                className="form-input"
                placeholder="Contoh: Jaket Denim Casual"
                value={
                  newProduct.name
                }
                onChange={(
                  event
                ) =>
                  setNewProduct({
                    ...newProduct,
                    name:
                      event
                        .target
                        .value,
                  })
                }
                required
              />

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Harga (Rp)
              </label>

              <input
                className="form-input"
                type="number"
                min="0"
                placeholder="150000"
                value={
                  newProduct.price
                }
                onChange={(
                  event
                ) =>
                  setNewProduct({
                    ...newProduct,
                    price:
                      event
                        .target
                        .value,
                  })
                }
                required
              />

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Kategori
              </label>

              <select
                className="form-input"
                value={
                  newProduct.category
                }
                onChange={(
                  event
                ) =>
                  setNewProduct({
                    ...newProduct,
                    category:
                      event
                        .target
                        .value as ProductCategory,
                  })
                }
              >
                {CATEGORIES.filter(
                  (category) =>
                    category.name !==
                    "Semua"
                ).map(
                  (category) => (
                    <option
                      key={
                        category.name
                      }
                      value={
                        category.name
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
              </select>

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Ukuran
              </label>

              <input
                className="form-input"
                placeholder="S, M, L, XL"
                value={
                  newProduct.sizes
                }
                onChange={(
                  event
                ) =>
                  setNewProduct({
                    ...newProduct,
                    sizes:
                      event
                        .target
                        .value,
                  })
                }
              />

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                Jumlah Stok Awal
              </label>

              <input
                className="form-input"
                type="number"
                min="0"
                value={
                  newProduct.stock
                }
                onChange={(
                  event
                ) =>
                  setNewProduct({
                    ...newProduct,
                    stock:
                      event
                        .target
                        .value,
                  })
                }
              />

              <label
                style={{
                  fontSize:
                    "12px",
                  fontWeight:
                    "bold",
                }}
              >
                URL Gambar
                (Opsional)
              </label>

              <input
                className="form-input"
                placeholder="https://..."
                value={
                  newProduct.image
                }
                onChange={(
                  event
                ) =>
                  setNewProduct({
                    ...newProduct,
                    image:
                      event
                        .target
                        .value,
                  })
                }
              />

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "8px",
                  marginTop:
                    "12px",
                }}
              >
                <button
                  type="button"
                  className="action-btn"
                  style={{
                    flex: 1,
                  }}
                  onClick={() =>
                    setIsAddProductOpen(
                      false
                    )
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="action-btn success"
                  style={{
                    flex: 1,
                  }}
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}