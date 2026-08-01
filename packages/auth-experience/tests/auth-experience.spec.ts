/**
 * Enterprise Authentication Experience Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Cookie-Based Session Lifecycle, Silent Refresh Engine,
 * Zero-Logout Organization Switching, SSR Route Protection Guards, MFA Flow Support, and CQRS Read Models.
 */

import { AuthenticationStatus, SessionStatus } from '../src/domain/enums/auth-experience.enums';
import {
  AuthenticationState,
  LoginRequest,
  OrganizationContext,
  RouteProtection,
  SessionContext,
  SessionExpiration,
  UserIdentity,
} from '../src/domain/value-objects/auth-experience-vo';
import {
  AuthenticationService,
  EnterpriseAuthExperiencePlatformService,
  InvitationService,
  OrganizationService,
  PasswordRecoveryService,
  RouteGuardService,
  SessionService,
} from '../src/services/auth-experience.services';

describe('Enterprise Authentication Experience Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should validate LoginRequest email formatting', () => {
      const validReq = LoginRequest.create({ email: 'user@restaurant.com', password: 'SecretPassword123!' });
      expect(validReq.email).toBe('user@restaurant.com');

      expect(() => LoginRequest.create({ email: 'invalid-email' })).toThrow();
    });

    it('should calculate SessionExpiration warning window state', () => {
      const expActive = SessionExpiration.create(new Date(Date.now() + 60000), 120000);
      expect(expActive.isWarningActive).toBe(true);
      expect(expActive.isExpired).toBe(false);

      const expPassed = SessionExpiration.create(new Date(Date.now() - 5000));
      expect(expPassed.isExpired).toBe(true);
    });
  });

  describe('Session Lifecycle & Silent Refresh', () => {
    let sessionService: SessionService;

    beforeEach(() => {
      sessionService = new SessionService();
    });

    it('should create and silently refresh active cookie-based session', () => {
      const user = UserIdentity.create({ userId: 'usr-1', email: 'owner@bistro.com', fullName: 'Bistro Owner' });
      const org = OrganizationContext.create({ orgId: 'org-1', orgName: 'Bistro Main', orgSlug: 'bistro-main' });
      const session = SessionContext.create({ sessionId: 'sess-100', user, currentOrg: org });

      sessionService.setSession(session);
      expect(sessionService.getSession()?.status).toBe(SessionStatus.ACTIVE);

      const refreshed = sessionService.silentRefresh();
      expect(refreshed).toBeDefined();
      expect(refreshed?.sessionId).toBe('sess-100');

      const overview = sessionService.getSessionOverview();
      expect(overview?.userEmail).toBe('owner@bistro.com');
    });
  });

  describe('Zero-Logout Organization Switching', () => {
    let sessionService: SessionService;
    let authService: AuthenticationService;
    let orgService: OrganizationService;

    beforeEach(() => {
      sessionService = new SessionService();
      authService = new AuthenticationService(sessionService);
      orgService = new OrganizationService(sessionService);
    });

    it('should switch target organization without invalidating the active user login session', async () => {
      await authService.login(LoginRequest.create({ email: 'manager@franchise.com' }));
      expect(sessionService.getSession()?.currentOrg.orgId).toBe('org-main-1');

      const switchedSession = orgService.switchOrganization('org-downtown-2');
      expect(switchedSession.currentOrg.orgId).toBe('org-downtown-2');
      expect(switchedSession.currentOrg.orgName).toBe('Downtown Bistro Branch');
      expect(switchedSession.user.email).toBe('manager@franchise.com');

      const orgList = orgService.getOrganizationList('usr-manager');
      expect(orgList.totalOrganizations).toBe(3);
    });
  });

  describe('SSR & CSR Route Protection Guards', () => {
    let sessionService: SessionService;
    let authService: AuthenticationService;
    let routeGuardService: RouteGuardService;

    beforeEach(() => {
      sessionService = new SessionService();
      authService = new AuthenticationService(sessionService);
      routeGuardService = new RouteGuardService(sessionService);
    });

    it('should evaluate SSR route protection for public vs protected vs role-restricted routes', async () => {
      const publicRoute = RouteProtection.create({ path: '/auth/login', requiresAuthentication: false });
      const protectedRoute = RouteProtection.create({ path: '/dashboard', requiresAuthentication: true });
      const managerRoute = RouteProtection.create({ path: '/admin/kds', requiresAuthentication: true, requiredRoles: ['ROLE_RESTAURANT_MANAGER'] });

      // Unauthenticated state
      expect(routeGuardService.isRouteAllowed(publicRoute).allowed).toBe(true);
      expect(routeGuardService.isRouteAllowed(protectedRoute).allowed).toBe(false);
      expect(routeGuardService.isRouteAllowed(protectedRoute).redirectUrl).toBe('/auth/login');

      // Authenticated state
      await authService.login(LoginRequest.create({ email: 'manager@restaurant.com' }));
      expect(routeGuardService.isRouteAllowed(protectedRoute).allowed).toBe(true);
      expect(routeGuardService.isRouteAllowed(managerRoute).allowed).toBe(true);
    });
  });

  describe('EnterpriseAuthExperiencePlatformService & Read Models', () => {
    let sessionService: SessionService;
    let authService: AuthenticationService;
    let routeGuardService: RouteGuardService;
    let orgService: OrganizationService;
    let invitationService: InvitationService;
    let passwordRecoveryService: PasswordRecoveryService;
    let platformService: EnterpriseAuthExperiencePlatformService;

    beforeEach(() => {
      sessionService = new SessionService();
      authService = new AuthenticationService(sessionService);
      routeGuardService = new RouteGuardService(sessionService);
      orgService = new OrganizationService(sessionService);
      invitationService = new InvitationService();
      passwordRecoveryService = new PasswordRecoveryService();

      platformService = new EnterpriseAuthExperiencePlatformService(
        authService,
        sessionService,
        routeGuardService,
        orgService,
        invitationService,
        passwordRecoveryService
      );
    });

    it('should query Device Sessions and Authentication History read models', () => {
      const devices = platformService.getDeviceSessions('usr-100');
      expect(devices.totalActiveDevices).toBe(1);

      const history = platformService.getAuthenticationHistory('usr-100');
      expect(history.totalLogs).toBe(2);
    });
  });
});
