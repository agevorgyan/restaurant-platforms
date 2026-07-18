import { ILoyaltyAccount } from '../entities/loyalty-account.interface';
import { ILoyaltyTransaction } from '../entities/loyalty-transaction.interface';
import { ILoyaltyAccountRepository } from '../repositories/loyalty-account.repository.interface';
import { LoyaltyTier, LoyaltyTierValue } from '../value-objects/loyalty-tier.value-object';
import { LoyaltyBalance } from '../value-objects/loyalty-balance.value-object';
import { LoyaltyPoints } from '../value-objects/loyalty-points.value-object';
import { LoyaltyExpirationPolicy } from '../value-objects/loyalty-expiration-policy.value-object';
import { LoyaltyTransactionType, LoyaltyTransactionTypeValue } from '../value-objects/loyalty-transaction-type.value-object';
import { LoyaltyTransactionReason } from '../value-objects/loyalty-transaction-reason.value-object';
import { CreateLoyaltyAccountDto, LoyaltyTransactionDto } from '../../application/dto/loyalty.dto';
import { validateCreateLoyaltyAccount, validateLoyaltyTransaction } from '../../application/validation/loyalty.schema';
import {
  LoyaltyAccountCreatedEvent,
  LoyaltyPointsEarnedEvent,
  LoyaltyPointsRedeemedEvent,
  LoyaltyPointsExpiredEvent,
  LoyaltyTierChangedEvent
} from '../events/loyalty.events';

export class LoyaltyDomainService {
  constructor(private readonly loyaltyRepo: ILoyaltyAccountRepository) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async createAccount(id: string, dto: CreateLoyaltyAccountDto): Promise<ILoyaltyAccount> {
    const errors = validateCreateLoyaltyAccount(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const existingCustomer = await this.loyaltyRepo.findByCustomerId(dto.restaurantId, dto.customerId);
    if (existingCustomer) throw new Error('Each customer may have only one loyalty account');

    const existingNumber = await this.loyaltyRepo.findByAccountNumber(dto.restaurantId, dto.accountNumber);
    if (existingNumber) throw new Error('Account number must be unique within the restaurant');

    const account: ILoyaltyAccount = {
      id,
      restaurantId: dto.restaurantId,
      customerId: dto.customerId,
      accountNumber: dto.accountNumber,
      tier: new LoyaltyTier('Bronze'),
      balance: new LoyaltyBalance(0),
      expirationPolicy: new LoyaltyExpirationPolicy('Never'),
      transactions: [],
      domainEvents: [new LoyaltyAccountCreatedEvent(id, dto.customerId, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.loyaltyRepo.save(account);
    return account;
  }

  async earnPoints(accountId: string, dto: LoyaltyTransactionDto): Promise<ILoyaltyAccount> {
    const account = await this.loyaltyRepo.findById(accountId);
    if (!account) throw new Error('Account not found');

    const errors = validateLoyaltyTransaction(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const points = new LoyaltyPoints(dto.points);
    const occurredAt = new Date();
    const expiresAt = account.expirationPolicy.calculateExpirationDate(occurredAt);

    const transaction: ILoyaltyTransaction = {
      id: this.generateId(),
      transactionType: new LoyaltyTransactionType('Earn'),
      reason: new LoyaltyTransactionReason(dto.reason),
      points: points,
      referenceType: dto.referenceType,
      referenceId: dto.referenceId,
      occurredAt,
      expiresAt
    };

    account.transactions.push(transaction);
    account.balance = account.balance.add(points.value);
    account.updatedAt = new Date();

    account.domainEvents = account.domainEvents || [];
    account.domainEvents.push(new LoyaltyPointsEarnedEvent(account.id, transaction.id, points.value));

    await this.loyaltyRepo.save(account);
    return account;
  }

  async redeemPoints(accountId: string, dto: LoyaltyTransactionDto): Promise<ILoyaltyAccount> {
    const account = await this.loyaltyRepo.findById(accountId);
    if (!account) throw new Error('Account not found');

    const errors = validateLoyaltyTransaction(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const points = new LoyaltyPoints(dto.points);
    account.balance = account.balance.subtract(points.value); // Validates balance non-negative automatically

    const transaction: ILoyaltyTransaction = {
      id: this.generateId(),
      transactionType: new LoyaltyTransactionType('Redeem'),
      reason: new LoyaltyTransactionReason(dto.reason),
      points: points,
      referenceType: dto.referenceType,
      referenceId: dto.referenceId,
      occurredAt: new Date()
    };

    account.transactions.push(transaction);
    account.updatedAt = new Date();

    account.domainEvents = account.domainEvents || [];
    account.domainEvents.push(new LoyaltyPointsRedeemedEvent(account.id, transaction.id, points.value));

    await this.loyaltyRepo.save(account);
    return account;
  }

  async expirePoints(accountId: string, dto: LoyaltyTransactionDto): Promise<ILoyaltyAccount> {
    const account = await this.loyaltyRepo.findById(accountId);
    if (!account) throw new Error('Account not found');

    const errors = validateLoyaltyTransaction(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const points = new LoyaltyPoints(dto.points);
    account.balance = account.balance.subtract(points.value);

    const transaction: ILoyaltyTransaction = {
      id: this.generateId(),
      transactionType: new LoyaltyTransactionType('Expire'),
      reason: new LoyaltyTransactionReason(dto.reason),
      points: points,
      referenceType: dto.referenceType,
      referenceId: dto.referenceId,
      occurredAt: new Date()
    };

    account.transactions.push(transaction);
    account.updatedAt = new Date();

    account.domainEvents = account.domainEvents || [];
    account.domainEvents.push(new LoyaltyPointsExpiredEvent(account.id, transaction.id, points.value));

    await this.loyaltyRepo.save(account);
    return account;
  }

  async adjustPoints(accountId: string, dto: LoyaltyTransactionDto, type: LoyaltyTransactionTypeValue): Promise<ILoyaltyAccount> {
    const account = await this.loyaltyRepo.findById(accountId);
    if (!account) throw new Error('Account not found');

    const errors = validateLoyaltyTransaction(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const points = new LoyaltyPoints(dto.points);
    if (type === 'Refund' || type === 'Adjustment') { // Just simplified for adjust type
       account.balance = account.balance.add(points.value); // Assume adjustments add, or need a subtract adjustment
    }

    const transaction: ILoyaltyTransaction = {
      id: this.generateId(),
      transactionType: new LoyaltyTransactionType(type),
      reason: new LoyaltyTransactionReason(dto.reason),
      points: points,
      referenceType: dto.referenceType,
      referenceId: dto.referenceId,
      occurredAt: new Date()
    };

    account.transactions.push(transaction);
    account.updatedAt = new Date();

    await this.loyaltyRepo.save(account);
    return account;
  }

  async changeTier(accountId: string, newTier: LoyaltyTierValue): Promise<ILoyaltyAccount> {
    const account = await this.loyaltyRepo.findById(accountId);
    if (!account) throw new Error('Account not found');

    const oldTier = account.tier.value;
    account.tier = new LoyaltyTier(newTier);
    account.updatedAt = new Date();

    account.domainEvents = account.domainEvents || [];
    account.domainEvents.push(new LoyaltyTierChangedEvent(account.id, oldTier, newTier));

    await this.loyaltyRepo.save(account);
    return account;
  }
}
