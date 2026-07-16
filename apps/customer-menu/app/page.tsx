"use client";

import { useEffect, useState, useTransition } from "react";
import { CATEGORIES, MENU_ITEMS, RESTAURANT_CONFIG } from "../config/menu";
import { MenuItem, CartItem, CustomizationChoice, DietaryTag } from "../types/menu";
import { DishModal } from "../components/dish-modal";
import { CartDrawer } from "../components/cart-drawer";
import { useAnalytics } from "../hooks/use-analytics";

export default function Home() {
  const { logEvent } = useAnalytics();
  const [isPending, startTransition] = useTransition();

  // State
  const [activeCategory, setActiveCategory] = useState("chef-specials");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [tableNumber, setTableNumber] = useState("12");
  
  // Cart & Modal State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Initialize client-side states (localStorage, URL query)
  useEffect(() => {
    // 1. Fetch table number from URL
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) {
      setTableNumber(table);
    }

    // 2. Fetch cart from localStorage
    try {
      const stored = localStorage.getItem(`cart_${table || "12"}`);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {
      // Handle potential storage restrictions
    }

    // 3. Log initial page view event
    logEvent("page_view", { category: "home" });
  }, [logEvent]);

  // Sync cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(`cart_${tableNumber}`, JSON.stringify(newCart));
    } catch {
      // Handle storage restrictions
    }
  };

  // Cart Handlers
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    customizations: Record<string, CustomizationChoice[]>,
    notes: string
  ) => {
    // Generate a unique ID for this cart line item based on customizations selected
    const customsPart = Object.entries(customizations)
      .flatMap(([_, choices]) => choices.map((c) => c.id))
      .sort()
      .join("-");
    const cartItemId = `${item.id}-${customsPart}-${notes ? encodeURIComponent(notes) : ""}`;

    const existingIndex = cart.findIndex((i) => i.id === cartItemId);
    const updated = [...cart];

    if (existingIndex > -1) {
      updated[existingIndex].quantity += quantity;
    } else {
      updated.push({
        id: cartItemId,
        menuItem: item,
        quantity,
        selectedCustomizations: customizations,
        notes,
      });
    }

    saveCart(updated);
    logEvent("add_to_cart", {
      itemId: item.id,
      itemName: item.name,
      value: item.price * quantity,
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    const updated = cart.map((item) =>
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updated);
  };

  const handleRemoveItem = (cartItemId: string) => {
    const item = cart.find((i) => i.id === cartItemId);
    const updated = cart.filter((item) => item.id !== cartItemId);
    saveCart(updated);
    if (item) {
      logEvent("remove_from_cart", {
        itemId: item.menuItem.id,
        itemName: item.menuItem.name,
      });
    }
  };

  const handleClearCart = () => {
    saveCart([]);
    logEvent("clear_cart");
  };

  // Filters toggling
  const handleDietaryToggle = (tag: DietaryTag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter & Search computation
  const filteredItems = MENU_ITEMS.filter((item) => {
    // 1. Category match
    const categoryMatches = item.dietary.includes(activeCategory as DietaryTag) || 
      MENU_ITEMS.some((mi) => mi.id === item.id && activeCategory === "all") ||
      (activeCategory === "chef-specials" && item.dietary.includes("chef-special")) ||
      (activeCategory === "appetizers" && item.id.startsWith("app-")) ||
      (activeCategory === "mains" && item.id.startsWith("main-")) ||
      (activeCategory === "desserts" && item.id.startsWith("dessert-")) ||
      (activeCategory === "drinks" && item.id.startsWith("drink-"));

    if (!categoryMatches) return false;

    // 2. Search match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.allergens.some((a) => a.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // 3. Dietary tag match
    if (selectedDietary.length > 0) {
      const matchesAllDietary = selectedDietary.every((tag) => item.dietary.includes(tag));
      if (!matchesAllDietary) return false;
    }

    return true;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500/25 selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900/60 transition-all duration-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-serif text-amber-500 tracking-wider font-semibold">
              {RESTAURANT_CONFIG.name}
            </span>
            <span className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-bold tracking-widest text-amber-400 rounded-full">
              Table {tableNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-xs md:max-w-sm justify-end">
            {/* Search Input */}
            <div className="relative w-full max-w-[180px] md:max-w-[240px]">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/80 border border-neutral-850 hover:border-neutral-800 focus:border-amber-500/30 rounded-full py-1.5 pl-9 pr-4 text-xs placeholder-neutral-500 focus:outline-none focus:ring-0 transition-all duration-200 text-neutral-200"
              />
              <svg
                className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 border border-neutral-850 hover:border-neutral-700 bg-neutral-900 rounded-full hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="View Order"
            >
              <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-neutral-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-12">
        
        {/* Luxury Hero Banner */}
        <section className="relative rounded-[32px] border border-neutral-900 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="absolute inset-0 bg-neutral-950 opacity-20 pointer-events-none" />
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-amber-500 uppercase">
              {RESTAURANT_CONFIG.tagline}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide font-normal">
              {RESTAURANT_CONFIG.name}
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              {RESTAURANT_CONFIG.description}
            </p>
            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium">
              <span>📍 {RESTAURANT_CONFIG.address}</span>
              <span>📞 {RESTAURANT_CONFIG.phone}</span>
            </div>
          </div>

          {/* Abstract elegant visual plate display */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border border-neutral-800/80 bg-neutral-900/40 p-4 shadow-xl flex items-center justify-center shrink-0 z-10">
            <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-spin [animation-duration:40s]" />
            <div className="w-full h-full rounded-full border border-neutral-800 bg-neutral-950 flex flex-col items-center justify-center p-4">
              <span className="text-4xl md:text-5xl">🍷</span>
              <span className="text-[9px] uppercase tracking-widest text-amber-400 mt-3 font-semibold">
                Est. 1982
              </span>
            </div>
          </div>
        </section>

        {/* Categories Navigation Bar */}
        <section className="space-y-4">
          <div className="flex overflow-x-auto gap-3 pb-3 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    startTransition(() => {
                      setActiveCategory(cat.id);
                    });
                    logEvent("select_category", { category: cat.id });
                  }}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/10 scale-105"
                      : "bg-neutral-900/60 border border-neutral-850 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="h-[1px] bg-neutral-900" />
        </section>

        {/* Dietary Filtering Row */}
        <section className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mr-2">
            Filter:
          </span>
          {(["vegan", "vegetarian", "gluten-free", "dairy-free"] as DietaryTag[]).map((tag) => {
            const isSelected = selectedDietary.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleDietaryToggle(tag)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all duration-200 ${
                  isSelected
                    ? "bg-neutral-200 border-neutral-200 text-neutral-950"
                    : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                {tag.replace("-", " ")}
              </button>
            );
          })}
        </section>

        {/* Menu Items Showcase */}
        <section className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-neutral-900/60 pb-3">
            <h2 className="text-xl font-serif text-white tracking-wide">
              {CATEGORIES.find((c) => c.id === activeCategory)?.name || "Menu Selection"}
            </h2>
            <span className="text-xs text-neutral-500">
              Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-20 text-center bg-neutral-950 border border-dashed border-neutral-900 rounded-3xl opacity-60">
              <span className="text-3xl block mb-3">🔍</span>
              <p className="text-sm text-neutral-400">No delicacies matching your preferences.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDietary([]);
                }}
                className="mt-4 text-xs font-semibold text-amber-500 hover:text-amber-400"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    logEvent("view_item", { itemId: item.id, itemName: item.name });
                  }}
                  className="group bg-neutral-950 border border-neutral-900 hover:border-neutral-800 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.01] hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    {/* Header: Name & Price */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-serif font-semibold text-white tracking-wide group-hover:text-amber-400 transition-colors duration-250">
                          {item.name}
                        </h3>
                        
                        {/* Dietary tags */}
                        {item.dietary.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {item.dietary.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.2 text-[8px] tracking-wider uppercase font-bold text-neutral-500 border border-neutral-900 rounded"
                              >
                                {tag.replace("-", " ")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-sm font-semibold text-amber-500 tracking-wide bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/10">
                        {RESTAURANT_CONFIG.currency.symbol}
                        {item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-neutral-900/60">
                    {/* Allergen icons */}
                    <div className="text-[10px] text-neutral-600 font-medium">
                      {item.allergens.length > 0 ? `Allergens: ${item.allergens.join(", ")}` : "Allergen Free"}
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 group-hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                      Configure
                      <svg
                        className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Info Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-10 mt-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500 font-medium">
          <div className="text-center md:text-left">
            <p className="text-sm font-serif text-neutral-400 font-semibold mb-1">
              {RESTAURANT_CONFIG.name}
            </p>
            <p>&copy; {new Date().getFullYear()} Restaurant Platform. All Rights Reserved.</p>
          </div>
          
          <div className="text-center md:text-right space-y-1.5">
            <p>🕒 {RESTAURANT_CONFIG.hours}</p>
            <p className="text-[10px] text-neutral-600">
              Prices exclude {Math.round(RESTAURANT_CONFIG.fees.taxRate * 100)}% state tax and discretionary{" "}
              {Math.round(RESTAURANT_CONFIG.fees.serviceChargeRate * 100)}% service charge.
            </p>
          </div>
        </div>
      </footer>

      {/* Item Modal Popup */}
      <DishModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
        currencySymbol={RESTAURANT_CONFIG.currency.symbol}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        config={RESTAURANT_CONFIG}
        tableNumber={tableNumber}
      />
    </div>
  );
}
