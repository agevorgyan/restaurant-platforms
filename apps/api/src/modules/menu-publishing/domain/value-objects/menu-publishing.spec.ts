import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { MenuVersion } from './menu-version.value-object';
import { PublicationHistory } from './publication-history.value-object';
import { MenuPublishingPolicy } from './menu-publishing-policy.value-object';

describe('Menu Publishing Domain Value Objects', () => {
  describe('MenuVersion', () => {
    it('should start at version 1', () => {
      const version = new MenuVersion();
      assert.strictEqual(version.version, 1);
    });

    it('should increment version', () => {
      const version = new MenuVersion(1);
      const next = version.increment();
      assert.strictEqual(next.version, 2);
    });

    it('should throw if version is less than 1', () => {
      assert.throws(() => new MenuVersion(0), /Version starts at 1/);
    });
  });

  describe('PublicationHistory', () => {
    it('should maintain immutability and allow adding entries', () => {
      const history = new PublicationHistory();
      assert.strictEqual(history.entries.length, 0);

      const entry = {
        action: 'Published' as const,
        timestamp: new Date(),
        userId: 'user-1',
        version: 1
      };

      const newHistory = history.addEntry(entry);
      assert.strictEqual(history.entries.length, 0); // Original is unchanged
      assert.strictEqual(newHistory.entries.length, 1);
      assert.strictEqual(newHistory.entries[0].userId, 'user-1');
    });
  });

  describe('MenuPublishingPolicy', () => {
    it('should create a valid draft policy', () => {
      const policy = new MenuPublishingPolicy('Draft', new MenuVersion(1), new PublicationHistory());
      assert.strictEqual(policy.status, 'Draft');
    });

    it('should transition to Published and record constraints', () => {
      const policy = new MenuPublishingPolicy('Draft', new MenuVersion(1), new PublicationHistory());
      const published = policy.publish('user-1', 1, 1, 'Initial publish');
      
      assert.strictEqual(published.status, 'Published');
      assert.strictEqual(published.version.version, 2);
      assert.strictEqual(published.publishedBy, 'user-1');
      assert.strictEqual(published.history.entries.length, 1);
      assert.strictEqual(published.history.entries[0].action, 'Published');
    });

    it('should throw if publishing an already Published menu', () => {
      const policy = new MenuPublishingPolicy('Published', new MenuVersion(2), new PublicationHistory());
      assert.throws(() => policy.publish('user-1', 1, 1), /Only Draft menus may be published/);
    });

    it('should throw if publishing with no active categories', () => {
      const policy = new MenuPublishingPolicy('Draft', new MenuVersion(1), new PublicationHistory());
      assert.throws(() => policy.publish('user-1', 0, 1), /Publishing requires at least one active category/);
    });

    it('should throw if publishing with no active products', () => {
      const policy = new MenuPublishingPolicy('Draft', new MenuVersion(1), new PublicationHistory());
      assert.throws(() => policy.publish('user-1', 1, 0), /Publishing requires at least one active product/);
    });

    it('should transition to Draft upon unpublish', () => {
      const policy = new MenuPublishingPolicy('Published', new MenuVersion(2), new PublicationHistory());
      const unpublished = policy.unpublish('user-2');
      
      assert.strictEqual(unpublished.status, 'Draft');
      assert.strictEqual(unpublished.unpublishedBy, 'user-2');
      assert.strictEqual(unpublished.history.entries.length, 1);
      assert.strictEqual(unpublished.history.entries[0].action, 'Unpublished');
    });

    it('should throw if unpublishing a Draft menu', () => {
      const policy = new MenuPublishingPolicy('Draft', new MenuVersion(1), new PublicationHistory());
      assert.throws(() => policy.unpublish('user-1'), /Only Published menus may be unpublished/);
    });

    it('should throw if publishing an Archived menu', () => {
      const policy = new MenuPublishingPolicy('Archived', new MenuVersion(3), new PublicationHistory());
      assert.throws(() => policy.publish('user-1', 1, 1), /Only Draft menus may be published/);
    });

    it('should transition to Archived', () => {
      const policy = new MenuPublishingPolicy('Draft', new MenuVersion(1), new PublicationHistory());
      const archived = policy.archive('user-1');
      
      assert.strictEqual(archived.status, 'Archived');
      assert.strictEqual(archived.archivedBy, 'user-1');
      assert.strictEqual(archived.history.entries.length, 1);
      assert.strictEqual(archived.history.entries[0].action, 'Archived');
    });
  });
});
