import { ICustomerWallet } from '../entities/customer-wallet.interface';
import { IWalletTransaction } from '../entities/wallet-transaction.interface';
import { ICustomerWalletRepository } from '../repositories/customer-wallet.repository.interface';
import { WalletBalance } from '../value-objects/wallet-balance.value-object';
import { WalletCurrency } from '../value-objects/wallet-currency.value-object';
import { WalletStatus } from '../value-objects/wallet-status.value-object';
import { WalletTransactionType, WalletTransactionTypeValue } from '../value-objects/wallet-transaction-type.value-object';
import { WalletTransactionStatus } from '../value-objects/wallet-transaction-status.value-object';
import { WalletReference } from '../value-objects/wallet-reference.value-object';
import { CreateWalletDto, WalletTransactionDto } from '../../application/dto/customer-wallet.dto';
import { validateCreateWallet, validateWalletTransaction } from '../../application/validation/customer-wallet.schema';
import {
  CustomerWalletCreatedEvent,
  WalletCreditedEvent,
  WalletDebitedEvent,
  WalletAdjustedEvent,
  WalletFrozenEvent,
  WalletUnfrozenEvent,
  WalletArchivedEvent
} from '../events/customer-wallet.events';

export class CustomerWalletDomainService {
  constructor(private readonly walletRepo: ICustomerWalletRepository) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private ensureMutable(wallet: ICustomerWallet) {
    if (wallet.status.isReadOnly()) {
      throw new Error('Closed or archived wallets are read-only');
    }
  }

  async createWallet(id: string, dto: CreateWalletDto): Promise<ICustomerWallet> {
    const errors = validateCreateWallet(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const existingCustomerWallet = await this.walletRepo.findByCustomerId(dto.restaurantId, dto.customerId);
    if (existingCustomerWallet) {
      throw new Error('Each customer may have only one wallet per restaurant');
    }

    const existingNumberWallet = await this.walletRepo.findByWalletNumber(dto.restaurantId, dto.walletNumber);
    if (existingNumberWallet) {
      throw new Error('Wallet number must be unique within the restaurant');
    }

    const wallet: ICustomerWallet = {
      id,
      restaurantId: dto.restaurantId,
      customerId: dto.customerId,
      walletNumber: dto.walletNumber,
      currency: new WalletCurrency(dto.currency),
      balance: new WalletBalance(0),
      status: new WalletStatus('Active'),
      isFrozen: false,
      transactions: [],
      domainEvents: [new CustomerWalletCreatedEvent(id, dto.customerId, dto.walletNumber)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.walletRepo.save(wallet);
    return wallet;
  }

  private createTransaction(
    type: WalletTransactionTypeValue,
    amount: number,
    currency: string,
    reference: string,
    description?: string
  ): IWalletTransaction {
    return {
      id: this.generateId(),
      transactionType: new WalletTransactionType(type),
      status: new WalletTransactionStatus('Completed'), // assuming synchronous domain logic success
      amount,
      currency: new WalletCurrency(currency),
      reference: new WalletReference(reference),
      description,
      occurredAt: new Date()
    };
  }

  async creditWallet(walletId: string, dto: WalletTransactionDto): Promise<ICustomerWallet> {
    const wallet = await this.walletRepo.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    this.ensureMutable(wallet);

    const errors = validateWalletTransaction(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const transaction = this.createTransaction('Credit', dto.amount, wallet.currency.value, dto.reference, dto.description);
    
    wallet.balance = wallet.balance.add(dto.amount);
    wallet.transactions.push(transaction);
    wallet.updatedAt = new Date();

    wallet.domainEvents = wallet.domainEvents || [];
    wallet.domainEvents.push(new WalletCreditedEvent(wallet.id, transaction.id, dto.amount));

    await this.walletRepo.save(wallet);
    return wallet;
  }

  async debitWallet(walletId: string, dto: WalletTransactionDto): Promise<ICustomerWallet> {
    const wallet = await this.walletRepo.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    this.ensureMutable(wallet);

    if (wallet.isFrozen) {
      throw new Error('Frozen wallets cannot process debit transactions');
    }

    const errors = validateWalletTransaction(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const transaction = this.createTransaction('Debit', dto.amount, wallet.currency.value, dto.reference, dto.description);
    
    // will throw inside WalletBalance if negative
    wallet.balance = wallet.balance.subtract(dto.amount);
    wallet.transactions.push(transaction);
    wallet.updatedAt = new Date();

    wallet.domainEvents = wallet.domainEvents || [];
    wallet.domainEvents.push(new WalletDebitedEvent(wallet.id, transaction.id, dto.amount));

    await this.walletRepo.save(wallet);
    return wallet;
  }

  async adjustBalance(walletId: string, dto: WalletTransactionDto, isAddition: boolean): Promise<ICustomerWallet> {
    const wallet = await this.walletRepo.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    this.ensureMutable(wallet);

    const errors = validateWalletTransaction(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const transaction = this.createTransaction('Adjustment', dto.amount, wallet.currency.value, dto.reference, dto.description);
    
    if (isAddition) {
      wallet.balance = wallet.balance.add(dto.amount);
    } else {
      wallet.balance = wallet.balance.subtract(dto.amount);
    }

    wallet.transactions.push(transaction);
    wallet.updatedAt = new Date();

    wallet.domainEvents = wallet.domainEvents || [];
    wallet.domainEvents.push(new WalletAdjustedEvent(wallet.id, transaction.id, isAddition ? dto.amount : -dto.amount));

    await this.walletRepo.save(wallet);
    return wallet;
  }

  async freezeWallet(walletId: string): Promise<ICustomerWallet> {
    const wallet = await this.walletRepo.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    this.ensureMutable(wallet);

    if (!wallet.isFrozen) {
      wallet.isFrozen = true;
      wallet.status = new WalletStatus('Frozen');
      wallet.updatedAt = new Date();
      wallet.domainEvents = wallet.domainEvents || [];
      wallet.domainEvents.push(new WalletFrozenEvent(wallet.id));
      await this.walletRepo.save(wallet);
    }

    return wallet;
  }

  async unfreezeWallet(walletId: string): Promise<ICustomerWallet> {
    const wallet = await this.walletRepo.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    this.ensureMutable(wallet);

    if (wallet.isFrozen) {
      wallet.isFrozen = false;
      wallet.status = new WalletStatus('Active');
      wallet.updatedAt = new Date();
      wallet.domainEvents = wallet.domainEvents || [];
      wallet.domainEvents.push(new WalletUnfrozenEvent(wallet.id));
      await this.walletRepo.save(wallet);
    }

    return wallet;
  }

  async closeWallet(walletId: string): Promise<ICustomerWallet> {
    const wallet = await this.walletRepo.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');

    if (wallet.status.value !== 'Closed' && wallet.status.value !== 'Archived') {
      wallet.status = new WalletStatus('Closed');
      wallet.updatedAt = new Date();
      await this.walletRepo.save(wallet);
    }

    return wallet;
  }

  async archiveWallet(walletId: string): Promise<ICustomerWallet> {
    const wallet = await this.walletRepo.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');

    if (wallet.status.value !== 'Archived') {
      wallet.status = new WalletStatus('Archived');
      wallet.updatedAt = new Date();
      wallet.domainEvents = wallet.domainEvents || [];
      wallet.domainEvents.push(new WalletArchivedEvent(wallet.id));
      await this.walletRepo.save(wallet);
    }

    return wallet;
  }
}
