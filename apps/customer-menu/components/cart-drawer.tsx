"use client";

import { useState } from "react";
import { CartItem, RestaurantConfig } from "../types/menu";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  config: RestaurantConfig;
  tableNumber: string;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  config,
  tableNumber,
}: CartDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const currencySymbol = config.currency.symbol;

  // Calculations
  const getSubtotal = () => {
    return cart.reduce((acc, item) => {
      let itemPrice = item.menuItem.price;
      Object.values(item.selectedCustomizations).forEach((choices) => {
        choices.forEach((choice) => {
          if (choice.priceAdjustment) {
            itemPrice += choice.priceAdjustment;
          }
        });
      });
      return acc + itemPrice * item.quantity;
    }, 0);
  };

  const subtotal = getSubtotal();
  const tax = subtotal * config.fees.taxRate;
  const serviceCharge = subtotal * config.fees.serviceChargeRate;
  const grandTotal = subtotal + tax + serviceCharge;

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    // Simulate API request to platform backend
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setOrderSuccess(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={orderSuccess ? handleCloseSuccess : onClose} />

      <div className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl z-10 animate-slide-in-right">
        {/* Success Modal overlay */}
        {orderSuccess ? (
          <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shadow-lg shadow-amber-500/5 mb-6 animate-bounce">
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-white tracking-wide">Order Transmitted</h3>
            <p className="mt-2 text-sm text-neutral-400 max-w-xs leading-relaxed">
              Your order has been sent to the kitchen. Chef is preparing your delicacies.
            </p>
            <div className="mt-6 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs text-neutral-400">
              Table <span className="font-semibold text-white">{tableNumber}</span> &bull; {config.name}
            </div>
            <button
              onClick={handleCloseSuccess}
              className="mt-8 w-48 bg-white hover:bg-neutral-200 text-black font-semibold text-sm rounded-full py-3.5 transition-all duration-200"
            >
              Continue Browsing
            </button>
          </div>
        ) : null}

        {/* Header */}
        <div className="p-6 border-b border-neutral-850 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide">Your Order</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Table {tableNumber} &bull; {cart.length} item{cart.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-full transition-all duration-200"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="text-4xl mb-4">🥂</div>
              <p className="text-sm text-neutral-400">No items selected yet.</p>
              <button
                onClick={onClose}
                className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Browse Our Menu
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemBasePrice = item.menuItem.price;
              const chosenCustoms: string[] = [];
              let addedCost = 0;

              Object.values(item.selectedCustomizations).forEach((choices) => {
                choices.forEach((c) => {
                  chosenCustoms.push(c.name);
                  if (c.priceAdjustment) {
                    addedCost += c.priceAdjustment;
                  }
                });
              });

              const unitPrice = itemBasePrice + addedCost;
              const itemTotal = unitPrice * item.quantity;

              return (
                <div key={item.id} className="p-4 bg-neutral-950 border border-neutral-850 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-white tracking-wide">{item.menuItem.name}</h4>
                      {chosenCustoms.length > 0 && (
                        <p className="text-xs text-neutral-500 font-medium">{chosenCustoms.join(", ")}</p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-amber-500/80 italic mt-1 bg-neutral-900 border border-neutral-850 rounded-lg px-2.5 py-1">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-neutral-300 shrink-0">
                      {currencySymbol}
                      {itemTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-neutral-900/60">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-xs font-medium text-neutral-500 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>

                    <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1 shadow-inner">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-all duration-200"
                        disabled={item.quantity <= 1}
                      >
                        —
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-all duration-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Billing Details */}
        {cart.length > 0 && (
          <div className="p-6 bg-neutral-950 border-t border-neutral-850 space-y-4">
            <div className="space-y-2 text-sm text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">
                  {currencySymbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Service Charge ({Math.round(config.fees.serviceChargeRate * 100)}%)</span>
                <span>
                  {currencySymbol}
                  {serviceCharge.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Tax ({Math.round(config.fees.taxRate * 100)}%)</span>
                <span>
                  {currencySymbol}
                  {tax.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-900 flex justify-between text-base font-semibold text-white">
                <span>Total Amount</span>
                <span className="text-amber-400">
                  {currencySymbol}
                  {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:bg-amber-500/50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] font-semibold text-sm rounded-full py-4 transition-all duration-200 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-3 mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-neutral-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <span>Place Table Order</span>
                  <span className="text-xs bg-neutral-950/20 px-2 py-0.5 rounded-full font-bold">
                    Table {tableNumber}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
