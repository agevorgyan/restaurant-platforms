import { PricingContext } from '../value-objects/pricing-context.value-object';
import { PricingBreakdown } from '../value-objects/pricing-breakdown.value-object';
import { Money } from '../value-objects/money.value-object';
import { Injectable } from '@nestjs/common';
import { IPricingPolicy } from '../interfaces/pricing-policy.interface';

@Injectable()
export class PricingEngine implements IPricingPolicy {
  public calculate(context: PricingContext): PricingBreakdown {
    const currency = context.currency;
    let subtotal = Money.zero(currency);
    let modifierTotal = Money.zero(currency);
    let discountTotal = Money.zero(currency);
    let serviceChargeTotal = Money.zero(currency);
    let taxTotal = Money.zero(currency);
    const deliveryFee = context.deliveryFee || Money.zero(currency);
    const tipTotal = context.tip || Money.zero(currency);

    // 1. Calculate item subtotal & 2. Apply modifier adjustments
    for (const item of context.items) {
      const itemBaseTotal = item.unitPrice.multiply(item.quantity);
      subtotal = subtotal.add(itemBaseTotal);

      for (const mod of item.modifiers) {
        const modTotal = mod.priceAdjustment.multiply(mod.quantity * item.quantity);
        modifierTotal = modifierTotal.add(modTotal);
        // Modifiers are part of the line item cost, so we add to subtotal
        subtotal = subtotal.add(modTotal);
      }
    }

    // 3. Apply promotions
    let subtotalAfterDiscount = subtotal;
    for (const promo of context.promotions) {
      let discountAmount = Money.zero(currency);
      if (promo.type === 'Percentage') {
        discountAmount = subtotal.percentage(promo.value);
      } else if (promo.type === 'FixedAmount') {
        discountAmount = new Money(promo.value, currency);
      }

      discountTotal = discountTotal.add(discountAmount);
      subtotalAfterDiscount = subtotalAfterDiscount.subtract(discountAmount);
    }

    // Discounts cannot reduce subtotal below zero
    if (subtotalAfterDiscount.isNegative()) {
      discountTotal = discountTotal.add(subtotalAfterDiscount); // Adjust discount total
      subtotalAfterDiscount = Money.zero(currency);
    }

    // 4. Apply service charges
    for (const charge of context.serviceCharges) {
      if (charge.type === 'Fixed') {
        serviceChargeTotal = serviceChargeTotal.add(new Money(charge.value, currency));
      } else if (charge.type === 'Percentage') {
        serviceChargeTotal = serviceChargeTotal.add(subtotalAfterDiscount.percentage(charge.value));
      }
    }

    // 5. Apply delivery fee is already captured (context.deliveryFee)
    if (deliveryFee.isNegative()) {
      throw new Error('Delivery fee cannot be negative');
    }

    // 6. Apply taxes
    const taxableAmount = subtotalAfterDiscount.add(serviceChargeTotal).add(deliveryFee);
    if (context.taxPolicy && context.taxPolicy.rules) {
      // Basic Exclusive / Compound tax calculation
      // For Inclusive, we'd need to extract it, but for this domain logic, we'll map standard exclusive calculations
      let currentTaxable = taxableAmount;
      for (const rule of context.taxPolicy.rules) {
        const ruleTax = currentTaxable.percentage(rule.percentage);
        taxTotal = taxTotal.add(ruleTax);

        if (context.taxPolicy.calculationMode === 'Compound') {
          currentTaxable = currentTaxable.add(ruleTax);
        }
      }
    }

    // 7. Apply tips
    if (tipTotal.isNegative()) {
      throw new Error('Tips cannot be negative');
    }

    // 8. Produce final grand total
    const grandTotal = taxableAmount.add(taxTotal).add(tipTotal);

    return new PricingBreakdown(
      subtotal,
      modifierTotal,
      discountTotal,
      serviceChargeTotal,
      deliveryFee,
      taxTotal,
      tipTotal,
      grandTotal,
      currency
    );
  }
}
