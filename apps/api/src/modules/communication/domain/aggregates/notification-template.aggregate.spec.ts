import { NotificationTemplate } from './notification-template.aggregate';
import { NotificationTemplateId } from '../value-objects/notification-template-id.value-object';
import { NotificationCategory, NotificationCategoryEnum } from '../value-objects/notification-category.value-object';
import { NotificationLanguage } from '../value-objects/notification-language.value-object';
import { NotificationTemplateStatusEnum } from '../value-objects/notification-status.value-object';
import { NotificationSubject } from '../value-objects/notification-subject.value-object';
import { NotificationBody } from '../value-objects/notification-body.value-object';
import { TemplateVersion } from '../entities/template-version.entity';
import { TemplateVariable, TemplateVariableType } from '../entities/template-variable.entity';

describe('NotificationTemplate Aggregate', () => {
  let templateId: NotificationTemplateId;
  let category: NotificationCategory;
  let language: NotificationLanguage;
  let variable: TemplateVariable;

  beforeEach(() => {
    templateId = NotificationTemplateId.create('tmpl-1');
    category = NotificationCategory.create(NotificationCategoryEnum.MARKETING);
    language = NotificationLanguage.create('en');
    variable = TemplateVariable.create('var-1', 'CustomerName', TemplateVariableType.STRING, true);
  });

  describe('Creation', () => {
    it('should create a valid notification template in Draft status', () => {
      const template = NotificationTemplate.create(templateId, 'Welcome Email', category, language);
      
      expect(template.templateId.value).toBe('tmpl-1');
      expect(template.name).toBe('Welcome Email');
      expect(template.status.value).toBe(NotificationTemplateStatusEnum.DRAFT);
      expect(template.versions.length).toBe(0);
      expect(template.variables.length).toBe(0);
      expect(template.domainEvents.length).toBe(1);
      expect(template.domainEvents[0].constructor.name).toBe('NotificationTemplateCreated');
    });

    it('should throw an error if name is empty', () => {
      expect(() => NotificationTemplate.create(templateId, '', category, language))
        .toThrow('Template name cannot be empty');
    });
  });

  describe('Variables Management', () => {
    let template: NotificationTemplate;

    beforeEach(() => {
      template = NotificationTemplate.create(templateId, 'Welcome Email', category, language);
    });

    it('should add a variable successfully', () => {
      template.addVariable(variable);
      expect(template.variables.length).toBe(1);
    });

    it('should prevent adding duplicate variables', () => {
      template.addVariable(variable);
      expect(() => template.addVariable(TemplateVariable.create('var-2', 'CustomerName', TemplateVariableType.STRING, false)))
        .toThrow('Variable CustomerName already exists in this template');
    });

    it('should prevent modifying variables on an archived template', () => {
      template.archive();
      expect(() => template.addVariable(variable)).toThrow('Cannot modify variables of an archived template');
    });
  });

  describe('Versions and Placeholders Management', () => {
    let template: NotificationTemplate;

    beforeEach(() => {
      template = NotificationTemplate.create(templateId, 'Welcome Email', category, language);
      template.addVariable(variable); // Requires 'CustomerName'
    });

    it('should throw error if a required placeholder is missing in the body', () => {
      const version = TemplateVersion.create(
        'ver-1', 
        1, 
        language, 
        NotificationSubject.create('Welcome!'), 
        NotificationBody.create('Hello, missing the placeholder.')
      );

      expect(() => template.addVersion(version)).toThrow('Template body is missing required placeholder: {{CustomerName}}');
    });

    it('should add version successfully when placeholder is present', () => {
      const version = TemplateVersion.create(
        'ver-1', 
        1, 
        language, 
        NotificationSubject.create('Welcome!'), 
        NotificationBody.create('Hello {{CustomerName}}, welcome to the platform.')
      );

      template.addVersion(version);
      expect(template.versions.length).toBe(1);
    });

    it('should prevent adding duplicate version numbers for the same language', () => {
      const version1 = TemplateVersion.create('ver-1', 1, language, NotificationSubject.create('Subj'), NotificationBody.create('{{CustomerName}}'));
      const version2 = TemplateVersion.create('ver-2', 1, language, NotificationSubject.create('Subj'), NotificationBody.create('{{CustomerName}}'));

      template.addVersion(version1);
      expect(() => template.addVersion(version2)).toThrow('Version 1 for language en already exists');
    });
  });

  describe('Publishing', () => {
    let template: NotificationTemplate;
    let version: TemplateVersion;

    beforeEach(() => {
      template = NotificationTemplate.create(templateId, 'Welcome Email', category, language);
      template.addVariable(variable);
      version = TemplateVersion.create(
        'ver-1', 
        1, 
        language, 
        NotificationSubject.create('Welcome!'), 
        NotificationBody.create('Hello {{CustomerName}}')
      );
      template.addVersion(version);
    });

    it('should publish a version and update template status', () => {
      template.publishVersion('ver-1');
      
      const publishedVersion = template.versions.find(v => v.id === 'ver-1');
      expect(publishedVersion?.isPublished).toBe(true);
      expect(publishedVersion?.publishedAt).toBeDefined();
      
      expect(template.status.value).toBe(NotificationTemplateStatusEnum.PUBLISHED);
      expect(template.domainEvents.some(e => e.constructor.name === 'NotificationTemplatePublished')).toBe(true);
    });

    it('should throw error if version is already published', () => {
      template.publishVersion('ver-1');
      expect(() => template.publishVersion('ver-1')).toThrow('This template version is already published');
    });
  });

  describe('Archiving', () => {
    let template: NotificationTemplate;

    beforeEach(() => {
      template = NotificationTemplate.create(templateId, 'Welcome Email', category, language);
    });

    it('should archive a template successfully', () => {
      template.archive();
      expect(template.status.value).toBe(NotificationTemplateStatusEnum.ARCHIVED);
      expect(template.domainEvents.some(e => e.constructor.name === 'NotificationTemplateArchived')).toBe(true);
    });
  });
});
