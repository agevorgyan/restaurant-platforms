"use client";

import { useEffect, useState } from "react";
import { MenuItem, CustomizationChoice, CustomizationOption } from "../types/menu";

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customizations: Record<string, CustomizationChoice[]>, notes: string) => void;
  currencySymbol: string;
}

export function DishModal({ item, onClose, onAddToCart, currencySymbol }: DishModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, CustomizationChoice[]>>({});
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes("");
      setErrorMessage(null);

      // Initialize default/required selections
      const initial: Record<string, CustomizationChoice[]> = {};
      item.customizations?.forEach((opt) => {
        if (opt.required && opt.choices.length > 0) {
          // Select the first option by default for required choices
          initial[opt.id] = [opt.choices[0]];
        } else {
          initial[opt.id] = [];
        }
      });
      setSelectedChoices(initial);
    }
  }, [item]);

  if (!item) return null;

  const handleChoiceSelect = (option: CustomizationOption, choice: CustomizationChoice) => {
    const current = selectedChoices[option.id] || [];

    if (option.maxChoices === 1) {
      // Radio behavior
      setSelectedChoices((prev) => ({
        ...prev,
        [option.id]: [choice],
      }));
    } else {
      // Checkbox behavior
      const exists = current.some((c) => c.id === choice.id);
      let updated: CustomizationChoice[];

      if (exists) {
        updated = current.filter((c) => c.id !== choice.id);
      } else {
        if (current.length >= option.maxChoices) {
          // Remove the first selected to stay within max choices limits
          updated = [...current.slice(1), choice];
        } else {
          updated = [...current, choice];
        }
      }

      setSelectedChoices((prev) => ({
        ...prev,
        [option.id]: updated,
      }));
    }
    setErrorMessage(null);
  };

  // Compute item unit price including customizations
  const getUnitPrice = () => {
    let price = item.price;
    Object.values(selectedChoices).forEach((choices) => {
      choices.forEach((choice) => {
        if (choice.priceAdjustment) {
          price += choice.priceAdjustment;
        }
      });
    });
    return price;
  };

  const handleAddClick = () => {
    // Validate required options
    const missingRequired = item.customizations?.filter((opt) => {
      const selections = selectedChoices[opt.id] || [];
      return opt.required && selections.length === 0;
    });

    if (missingRequired && missingRequired.length > 0) {
      setErrorMessage(`Please make a selection for: ${missingRequired.map((o) => o.name).join(", ")}`);
      return;
    }

    onAddToCart(item, quantity, selectedChoices, notes);
    onClose();
  };

  const unitPrice = getUnitPrice();
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 border border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-full transition-all duration-200"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero Banner / Cover */}
        <div className="relative h-64 bg-gradient-to-br from-neutral-800 to-neutral-950 flex-shrink-0">
          <div className="absolute inset-0 bg-neutral-950 opacity-40" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            {/* Elegant visual placeholder for dishes */}
            <div className="w-24 h-24 rounded-full border border-amber-500/20 bg-amber-500/5 flex items-center justify-center shadow-lg shadow-amber-500/5 animate-pulse">
              <span className="text-4xl">🍽️</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-serif font-semibold text-white tracking-wide">{item.name}</h2>
              <span className="text-xl font-medium text-amber-400">
                {currencySymbol}
                {item.price.toFixed(2)}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{item.description}</p>

            {item.dietary.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.dietary.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs rounded-full font-medium tracking-wide uppercase bg-neutral-800 text-neutral-300 border border-neutral-700"
                  >
                    {tag.replace("-", " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Customization Options */}
          {item.customizations?.map((option) => {
            const selections = selectedChoices[option.id] || [];
            return (
              <div key={option.id} className="p-5 bg-neutral-950 border border-neutral-850 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-neutral-200 tracking-wide">
                    {option.name}
                    {option.required && <span className="text-amber-500 ml-1.5">*</span>}
                  </h3>
                  <span className="text-xs text-neutral-500 font-medium">
                    {option.required ? "Required" : `Choose up to ${option.maxChoices}`}
                  </span>
                </div>

                <div className="grid gap-3">
                  {option.choices.map((choice) => {
                    const isSelected = selections.some((c) => c.id === choice.id);
                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleChoiceSelect(option, choice)}
                        className={`flex justify-between items-center px-4 py-3 border rounded-xl text-left transition-all duration-200 group ${
                          isSelected
                            ? "bg-amber-500/5 border-amber-500/40 text-white shadow-sm shadow-amber-500/5"
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Selection indicator */}
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all duration-200 ${
                              isSelected
                                ? "border-amber-500 bg-amber-500"
                                : "border-neutral-600 bg-neutral-950"
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 8 8" fill="currentColor">
                                <circle cx="4" cy="4" r="2.5" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium">{choice.name}</span>
                        </div>
                        {choice.priceAdjustment && (
                          <span className={`text-xs font-semibold ${isSelected ? "text-amber-400" : "text-neutral-500"}`}>
                            +{currencySymbol}
                            {choice.priceAdjustment.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Requests */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-semibold text-neutral-200 block">
              Special Instructions
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. No butter, dressing on the side, allergies to specific seeds..."
              rows={3}
              maxLength={250}
              className="w-full bg-neutral-950 border border-neutral-850 rounded-2xl p-4 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 resize-none transition-all duration-200"
            />
          </div>

          {/* Allergens warning */}
          {item.allergens.length > 0 && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 items-start">
              <span className="text-amber-500 text-sm">⚠️</span>
              <div>
                <p className="text-xs font-semibold text-amber-500">Allergen Notice</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Contains: {item.allergens.join(", ")}. Please inform your server if you have any severe allergies.
                </p>
              </div>
            </div>
          )}

          {errorMessage && <p className="text-sm font-medium text-red-400 text-center animate-shake">{errorMessage}</p>}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 bg-neutral-950 border-t border-neutral-850 gap-4 flex-shrink-0">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1.5 shadow-inner">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-all duration-200"
              disabled={quantity <= 1}
            >
              —
            </button>
            <span className="w-12 text-center text-sm font-semibold text-white">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-all duration-200"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddClick}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 hover:scale-[1.01] active:scale-[0.99] font-semibold text-sm rounded-full py-4 transition-all duration-200 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            <span>Add to Order</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 opacity-40" />
            <span>
              {currencySymbol}
              {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
