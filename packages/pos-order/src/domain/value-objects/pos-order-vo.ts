/**
 * Enterprise POS Order Entry Platform - Value Objects
 *
 * Immutable Value Objects encapsulating order identifiers, line items, monetary amounts,
 * modifier selections, combo selections, seat/course numbers, guest counts, and price breakdowns.
 */

/**
 * Identifiers: OrderId, OrderNumber, OrderLineId
 */
export class OrderId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): OrderId {
    return new OrderId(id || `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class OrderNumber {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value?: string): OrderNumber {
    return new OrderNumber(value || `#${Math.floor(100 + Math.random() * 900)}`);
  }
}

export class OrderLineId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): OrderLineId {
    return new OrderLineId(id || `line-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

/**
 * Quantity & Money Value Objects
 */
export class Quantity {
  public readonly value: number;

  private constructor(value: number) {
    if (value <= 0) throw new Error('Quantity must be greater than zero');
    this.value = value;
  }

  public static create(value: number): Quantity {
    return new Quantity(value);
  }
}

export class Money {
  public readonly amount: number;
  public readonly currency: string;

  private constructor(amount: number, currency: string) {
    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency;
  }

  public static create(amount: number, currency: string = 'USD'): Money {
    return new Money(amount, currency);
  }

  public add(other: Money): Money {
    return new Money(this.amount + other.amount, this.currency);
  }

  public multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }
}

/**
 * ModifierSelection & ComboSelection Value Objects
 */
export class ModifierSelection {
  public readonly modifierId: string;
  public readonly name: string;
  public readonly priceDelta: Money;

  private constructor(modifierId: string, name: string, priceDelta: Money) {
    this.modifierId = modifierId;
    this.name = name;
    this.priceDelta = priceDelta;
  }

  public static create(modifierId: string, name: string, priceDeltaAmount: number = 0): ModifierSelection {
    return new ModifierSelection(modifierId, name, Money.create(priceDeltaAmount));
  }
}

export class ComboSelection {
  public readonly comboId: string;
  public readonly comboName: string;
  public readonly selectedItems: string[];

  private constructor(comboId: string, comboName: string, selectedItems: string[]) {
    this.comboId = comboId;
    this.comboName = comboName;
    this.selectedItems = selectedItems;
  }

  public static create(comboId: string, comboName: string, selectedItems: string[] = []): ComboSelection {
    return new ComboSelection(comboId, comboName, selectedItems);
  }
}

/**
 * SeatNumber & CourseNumber & GuestCount Value Objects
 */
export class SeatNumber {
  public readonly seatNo: number;

  private constructor(seatNo: number) {
    this.seatNo = Math.max(1, seatNo);
  }

  public static create(seatNo: number = 1): SeatNumber {
    return new SeatNumber(seatNo);
  }
}

export class CourseNumber {
  public readonly courseNo: number; // 1 = Starter, 2 = Main, 3 = Dessert
  public readonly courseName: string;

  private constructor(courseNo: number, courseName: string) {
    this.courseNo = courseNo;
    this.courseName = courseName;
  }

  public static create(courseNo: number = 1, courseName: string = 'Starter'): CourseNumber {
    return new CourseNumber(courseNo, courseName);
  }
}

export class GuestCount {
  public readonly count: number;

  private constructor(count: number) {
    this.count = Math.max(1, count);
  }

  public static create(count: number = 2): GuestCount {
    return new GuestCount(count);
  }
}

/**
 * OrderNote & PriceBreakdown Value Objects
 */
export class OrderNote {
  public readonly text: string;

  private constructor(text: string) {
    this.text = text;
  }

  public static create(text: string): OrderNote {
    return new OrderNote(text);
  }
}

export class PriceBreakdown {
  public readonly subtotal: Money;
  public readonly modifierTotal: Money;
  public readonly discountTotal: Money;
  public readonly taxTotal: Money;
  public readonly grandTotal: Money;

  private constructor(subtotal: Money, modifierTotal: Money, discountTotal: Money, taxTotal: Money) {
    this.subtotal = subtotal;
    this.modifierTotal = modifierTotal;
    this.discountTotal = discountTotal;
    this.taxTotal = taxTotal;
    const net = subtotal.add(modifierTotal).amount - discountTotal.amount + taxTotal.amount;
    this.grandTotal = Money.create(net);
  }

  public static calculate(subtotal: Money, modifierTotal: Money, discountTotal: Money, taxTotal: Money): PriceBreakdown {
    return new PriceBreakdown(subtotal, modifierTotal, discountTotal, taxTotal);
  }
}
