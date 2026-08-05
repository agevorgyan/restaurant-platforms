import { GeneralLedgerPlatformService } from '../src/services/general-ledger-platform.service';
import { AccountType } from '../src/domain/enums/account-type.enum';
import { AccountStatus } from '../src/domain/enums/account-status.enum';

describe('Enterprise General Ledger & Chart of Accounts Platform', () => {
  let platformService: GeneralLedgerPlatformService;
  const tenantId = 'tenant_rest_1001';

  beforeEach(() => {
    platformService = new GeneralLedgerPlatformService();
  });

  describe('Chart of Accounts & Account Management', () => {
    it('should create Chart of Accounts and add root GL accounts', () => {
      const assetAcc = platformService.createAccount(tenantId, {
        code: '1000',
        name: 'Assets',
        type: AccountType.ASSET,
        isHeaderAccount: true,
      });

      expect(assetAcc.getCode().getValue()).toBe('1000');
      expect(assetAcc.getName().getValue()).toBe('Assets');
      expect(assetAcc.getStatus()).toBe(AccountStatus.ACTIVE);
      expect(assetAcc.isHeaderAccount()).toBe(true);

      const coaModel = platformService.getChartOfAccountsReadModel(tenantId);
      expect(coaModel.totalAccounts).toBe(1);
      expect(coaModel.accounts[0].code).toBe('1000');
    });

    it('should enforce account code uniqueness per tenant', () => {
      platformService.createAccount(tenantId, {
        code: '1000',
        name: 'Assets',
        type: AccountType.ASSET,
      });

      expect(() => {
        platformService.createAccount(tenantId, {
          code: '1000',
          name: 'Duplicate Assets',
          type: AccountType.ASSET,
        });
      }).toThrow('Account code 1000 is already taken in Chart of Accounts.');
    });

    it('should configure posting rules on GL accounts', () => {
      platformService.createAccount(tenantId, {
        code: '1100',
        name: 'Cash on Hand',
        type: AccountType.ASSET,
        postingRule: { allowManual: true, allowAutomated: true },
      });

      const updated = platformService.updatePostingRule(tenantId, '1100', {
        allowManualPosting: false,
        allowAutomatedPosting: true,
      });

      expect(updated.getPostingRule().isManualPostingAllowed()).toBe(false);
      expect(updated.getPostingRule().isAutomatedPostingAllowed()).toBe(true);

      const rulesModel = platformService.getPostingRulesReadModel(tenantId);
      expect(rulesModel.rules.find((r) => r.accountCode === '1100')?.allowManualPosting).toBe(false);
    });

    it('should archive accounts safely when no active children exist', () => {
      const acc = platformService.createAccount(tenantId, {
        code: '5999',
        name: 'Miscellaneous Expense',
        type: AccountType.EXPENSE,
      });

      platformService.archiveAccount(tenantId, acc.getId().getValue());

      const coaModel = platformService.getChartOfAccountsReadModel(tenantId);
      const archived = coaModel.accounts.find((a) => a.code === '5999');
      expect(archived?.status).toBe(AccountStatus.ARCHIVED);
    });
  });
});
