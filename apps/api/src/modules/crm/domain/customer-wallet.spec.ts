import { describe, it, beforeEach } from 'node:test';
import * as assert from 'node:assert';
import { WalletBalance } from './value-objects/wallet-balance.value-object';
import { WalletCurrency } from './value-objects/wallet-currency.value-object';
import { WalletTransactionType } from './value-objects/wallet-transaction-type.value-object';
import { WalletTransactionStatus } from './value-objects/wallet-transaction-status.value-object';
import { WalletReference } from './value-objects/wallet-reference.value-object';
import { WalletStatus } from './value-objects/wallet-status.value-object';
import { CustomerWalletDomainService } from './services/customer-wallet.domain.service';
import { ICustomerWalletRepository } from './repositories/customer-wallet.repository.interface';
import { ICustomerWallet } from './entities/customer-wallet.interface';
import { validateCreateWallet, validateWalletTransaction } from '../application/validation/customer-wallet.schema';

describe('Customer Wallet Domain', () => {
  describe('Value Objects', () => {
    it('WalletBalance should enforce non-negative rules', () => {
      const balance = new WalletBalance(100);
      assert.strictEqual(balance.value, 100);
      
      const added = balance.add(50);
      assert.strictEqual(added.value, 150);

      const subtracted = balance.subtract(50);
      assert.strictEqual(subtracted.value, 50);

      assert.throws(() => balance.subtract(150), /Balance cannot become negative/);
      assert.throws(() => balance.add(-10), /Amount must be greater than zero/);
    });

    it('WalletCurrency should validate', () => {
      assert.doesNotThrow(() => new WalletCurrency('USD'));
      assert.throws(() => new WalletCurrency(''));
    });

    it('WalletTransactionType should validate', () => {
      assert.doesNotThrow(() => new WalletTransactionType('Credit'));
      assert.throws(() => new WalletTransactionType('Unknown' as any));
    });

    it('WalletTransactionStatus should validate', () => {
      assert.doesNotThrow(() => new WalletTransactionStatus('Completed'));
      assert.throws(() => new WalletTransactionStatus('Unknown' as any));
    });

    it('WalletReference should validate', () => {
      assert.doesNotThrow(() => new WalletReference('REF123'));
      assert.throws(() => new WalletReference(''));
    });

    it('WalletStatus should handle read-only checks', () => {
      const active = new WalletStatus('Active');
      const closed = new WalletStatus('Closed');
      const archived = new WalletStatus('Archived');
      
      assert.strictEqual(active.isReadOnly(), false);
      assert.strictEqual(closed.isReadOnly(), true);
      assert.strictEqual(archived.isReadOnly(), true);
    });
  });

  describe('Validation', () => {
    it('should validate CreateWalletDto', () => {
      const err = validateCreateWallet({ restaurantId: '', customerId: 'c1', walletNumber: 'W1', currency: 'USD' });
      assert.strictEqual(err.length, 1);
    });

    it('should validate WalletTransactionDto', () => {
      const err = validateWalletTransaction({ amount: -10, reference: 'REF' });
      assert.strictEqual(err.length, 1);
      assert.strictEqual(err[0], 'Transaction amount must be greater than zero');
      
      const err2 = validateWalletTransaction({ amount: 10, reference: '' });
      assert.strictEqual(err2.length, 1);
    });
  });

  describe('CustomerWalletDomainService', () => {
    let mockWallets: ICustomerWallet[] = [];
    const mockRepo: ICustomerWalletRepository = {
      findById: async (id) => mockWallets.find(w => w.id === id) || null,
      findByCustomerId: async (rid, cid) => mockWallets.find(w => w.restaurantId === rid && w.customerId === cid) || null,
      findByWalletNumber: async (rid, num) => mockWallets.find(w => w.restaurantId === rid && w.walletNumber === num) || null,
      save: async (w) => {
        const i = mockWallets.findIndex(mw => mw.id === w.id);
        if (i >= 0) mockWallets[i] = w;
        else mockWallets.push(w);
      }
    };
    const service = new CustomerWalletDomainService(mockRepo);

    beforeEach(() => {
      mockWallets = [];
    });

    it('should enforce unique wallet rules', async () => {
      await service.createWallet('w1', { restaurantId: 'r1', customerId: 'c1', walletNumber: 'W-01', currency: 'USD' });

      try {
        await service.createWallet('w2', { restaurantId: 'r1', customerId: 'c1', walletNumber: 'W-02', currency: 'USD' });
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Each customer may have only one wallet per restaurant');
      }

      try {
        await service.createWallet('w3', { restaurantId: 'r1', customerId: 'c2', walletNumber: 'W-01', currency: 'USD' });
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Wallet number must be unique within the restaurant');
      }
    });

    it('should process credits and debits correctly', async () => {
      await service.createWallet('w1', { restaurantId: 'r1', customerId: 'c1', walletNumber: 'W-01', currency: 'USD' });

      let wallet = await service.creditWallet('w1', { amount: 100, reference: 'DEP1' });
      assert.strictEqual(wallet.balance.value, 100);
      assert.strictEqual(wallet.transactions.length, 1);

      wallet = await service.debitWallet('w1', { amount: 30, reference: 'PAY1' });
      assert.strictEqual(wallet.balance.value, 70);
      assert.strictEqual(wallet.transactions.length, 2);

      try {
        await service.debitWallet('w1', { amount: 80, reference: 'PAY2' });
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Balance cannot become negative');
      }
    });

    it('should prevent debit on frozen wallet', async () => {
      await service.createWallet('w1', { restaurantId: 'r1', customerId: 'c1', walletNumber: 'W-01', currency: 'USD' });
      await service.creditWallet('w1', { amount: 100, reference: 'DEP1' });
      
      await service.freezeWallet('w1');

      try {
        await service.debitWallet('w1', { amount: 30, reference: 'PAY1' });
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Frozen wallets cannot process debit transactions');
      }

      // But credit should still work if not explicitly denied by prompt. 
      // Prompt says: "Frozen wallets cannot process debit transactions." It doesn't explicitly block credits, but usually we block all? Wait, "Frozen wallets cannot process debit transactions." I only blocked debit. Let's see if credit works.
      await service.creditWallet('w1', { amount: 50, reference: 'DEP2' });
      const wallet = mockWallets.find(w => w.id === 'w1')!;
      assert.strictEqual(wallet.balance.value, 150);

      // Unfreeze allows debit again
      await service.unfreezeWallet('w1');
      await service.debitWallet('w1', { amount: 30, reference: 'PAY3' });
      assert.strictEqual(wallet.balance.value, 120);
    });

    it('should enforce read-only on closed or archived wallets', async () => {
      await service.createWallet('w1', { restaurantId: 'r1', customerId: 'c1', walletNumber: 'W-01', currency: 'USD' });
      await service.archiveWallet('w1');

      try {
        await service.creditWallet('w1', { amount: 100, reference: 'DEP1' });
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Closed or archived wallets are read-only');
      }
    });
  });
});
