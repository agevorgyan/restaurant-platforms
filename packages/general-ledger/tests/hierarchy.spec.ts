import { GeneralLedgerPlatformService } from '../src/services/general-ledger-platform.service';
import { AccountType } from '../src/domain/enums/account-type.enum';

describe('Account Hierarchy & Tree Navigation', () => {
  let platformService: GeneralLedgerPlatformService;
  const tenantId = 'tenant_rest_2002';

  beforeEach(() => {
    platformService = new GeneralLedgerPlatformService();
  });

  it('should build hierarchical account paths for parent-child accounts', () => {
    const parent = platformService.createAccount(tenantId, {
      code: '1000',
      name: 'Current Assets',
      type: AccountType.ASSET,
      isHeaderAccount: true,
    });

    const child = platformService.createAccount(tenantId, {
      code: '1100',
      name: 'Bank Accounts',
      type: AccountType.ASSET,
      parentAccountId: parent.getId().getValue(),
    });

    const grandChild = platformService.createAccount(tenantId, {
      code: '1110',
      name: 'Operating Checking Account',
      type: AccountType.ASSET,
      parentAccountId: child.getId().getValue(),
    });

    expect(parent.getPath().getValue()).toBe('1000');
    expect(child.getPath().getValue()).toBe('1000.1100');
    expect(grandChild.getPath().getValue()).toBe('1000.1100.1110');

    const treeReadModel = platformService.getAccountHierarchyReadModel(tenantId);
    expect(treeReadModel.rootCount).toBe(1);
    expect(treeReadModel.hierarchy[0].code).toBe('1000');
    expect(treeReadModel.hierarchy[0].children[0].code).toBe('1100');
    expect(treeReadModel.hierarchy[0].children[0].children[0].code).toBe('1110');
  });

  it('should prevent cyclic parent assignment in hierarchy', () => {
    const root = platformService.createAccount(tenantId, {
      code: '2000',
      name: 'Liabilities',
      type: AccountType.LIABILITY,
    });

    const child = platformService.createAccount(tenantId, {
      code: '2100',
      name: 'Current Liabilities',
      type: AccountType.LIABILITY,
      parentAccountId: root.getId().getValue(),
    });

    expect(() => {
      platformService.reparentAccount(tenantId, root.getId().getValue(), child.getId().getValue());
    }).toThrow('Cycle detected');
  });

  it('should calculate account statistics read model accurately', () => {
    platformService.createAccount(tenantId, { code: '1000', name: 'Assets', type: AccountType.ASSET });
    platformService.createAccount(tenantId, { code: '2000', name: 'Liabilities', type: AccountType.LIABILITY });
    platformService.createAccount(tenantId, { code: '4000', name: 'Sales Revenue', type: AccountType.REVENUE });
    platformService.createAccount(tenantId, { code: '5000', name: 'Cost of Goods Sold', type: AccountType.EXPENSE });

    const stats = platformService.getAccountStatisticsReadModel(tenantId);
    expect(stats.totalAccounts).toBe(4);
    expect(stats.countsByType[AccountType.ASSET]).toBe(1);
    expect(stats.countsByType[AccountType.LIABILITY]).toBe(1);
    expect(stats.countsByType[AccountType.REVENUE]).toBe(1);
    expect(stats.countsByType[AccountType.EXPENSE]).toBe(1);
  });
});
