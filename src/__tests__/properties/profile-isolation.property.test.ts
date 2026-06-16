import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Feature: admin-login-beneficiary-auth, Property 5: Isolamento de perfis de autenticação

/**
 * Pure access control function for profile isolation.
 *
 * Given a profile ('admin' | 'beneficiario') and a route string,
 * returns 'allowed' if the profile can access the route, 'denied' otherwise.
 *
 * Rules:
 * - Admin profile: allowed for /admin/*, denied for /beneficiario/*
 * - Beneficiary profile: allowed for /beneficiario/*, denied for /admin/*
 */
export function checkProfileAccess(
  profile: 'admin' | 'beneficiario',
  route: string
): 'allowed' | 'denied' {
  const normalizedRoute = route.toLowerCase();

  if (profile === 'admin') {
    if (normalizedRoute.startsWith('/beneficiario/') || normalizedRoute === '/beneficiario') {
      return 'denied';
    }
    if (normalizedRoute.startsWith('/admin/') || normalizedRoute === '/admin') {
      return 'allowed';
    }
  }

  if (profile === 'beneficiario') {
    if (normalizedRoute.startsWith('/admin/') || normalizedRoute === '/admin') {
      return 'denied';
    }
    if (normalizedRoute.startsWith('/beneficiario/') || normalizedRoute === '/beneficiario') {
      return 'allowed';
    }
  }

  return 'denied';
}

/**
 * Validates: Requirements 4.1, 4.2, 4.3
 *
 * Property 5: Isolamento de perfis de autenticação
 *
 * Para qualquer token JWT de admin e qualquer rota de beneficiário (/beneficiario/*),
 * o acesso deve ser negado. Simetricamente, para qualquer sessão de beneficiário (Parse)
 * e qualquer rota de admin (/admin/*), o acesso deve ser negado.
 */
describe('Property 5: Isolamento de perfis de autenticação', () => {
  // --- Generators ---

  // Generate random admin route segments
  const adminSegmentArb = fc.oneof(
    fc.constant('dashboard'),
    fc.constant('solicitacoes'),
    fc.constant('login'),
    fc.constant('usuarios'),
    fc.constant('configuracoes'),
    fc.stringMatching(/^[a-z0-9-]{1,20}$/)
  );

  // Generate random beneficiary route segments
  const beneficiarySegmentArb = fc.oneof(
    fc.constant('boletos'),
    fc.constant('solicitacoes'),
    fc.constant('perfil'),
    fc.constant('exames'),
    fc.constant('historico'),
    fc.stringMatching(/^[a-z0-9-]{1,20}$/)
  );

  // Generate UUID-like segments for dynamic routes
  const uuidSegmentArb = fc.uuid();

  // Generate sub-paths like /nova, /detalhe, /:id
  const subPathArb = fc.oneof(
    fc.constant(''),
    fc.constant('/nova'),
    fc.constant('/editar'),
    fc.constant('/detalhe'),
    uuidSegmentArb.map((uuid) => `/${uuid}`)
  );

  // Generate complete admin routes: /admin/dashboard, /admin/solicitacoes/uuid, etc.
  const adminRouteArb = fc
    .tuple(adminSegmentArb, subPathArb)
    .map(([segment, subPath]) => `/admin/${segment}${subPath}`);

  // Generate complete beneficiary routes: /beneficiario/boletos, /beneficiario/solicitacoes/nova, etc.
  const beneficiaryRouteArb = fc
    .tuple(beneficiarySegmentArb, subPathArb)
    .map(([segment, subPath]) => `/beneficiario/${segment}${subPath}`);

  // --- Tests ---

  it('admin is always denied access to any beneficiary route', () => {
    fc.assert(
      fc.property(beneficiaryRouteArb, (route) => {
        const result = checkProfileAccess('admin', route);
        expect(result).toBe('denied');
      }),
      { numRuns: 100 }
    );
  });

  it('beneficiary is always denied access to any admin route', () => {
    fc.assert(
      fc.property(adminRouteArb, (route) => {
        const result = checkProfileAccess('beneficiario', route);
        expect(result).toBe('denied');
      }),
      { numRuns: 100 }
    );
  });

  it('admin is always allowed access to any admin route', () => {
    fc.assert(
      fc.property(adminRouteArb, (route) => {
        const result = checkProfileAccess('admin', route);
        expect(result).toBe('allowed');
      }),
      { numRuns: 100 }
    );
  });

  it('beneficiary is always allowed access to any beneficiary route', () => {
    fc.assert(
      fc.property(beneficiaryRouteArb, (route) => {
        const result = checkProfileAccess('beneficiario', route);
        expect(result).toBe('allowed');
      }),
      { numRuns: 100 }
    );
  });

  it('isolation is symmetric: cross-profile access is always denied', () => {
    fc.assert(
      fc.property(
        fc.oneof(adminRouteArb, beneficiaryRouteArb),
        fc.oneof(fc.constant('admin' as const), fc.constant('beneficiario' as const)),
        (route, profile) => {
          const result = checkProfileAccess(profile, route);

          const isAdminRoute = route.startsWith('/admin/') || route === '/admin';
          const isBenefRoute = route.startsWith('/beneficiario/') || route === '/beneficiario';

          if (profile === 'admin' && isBenefRoute) {
            expect(result).toBe('denied');
          } else if (profile === 'beneficiario' && isAdminRoute) {
            expect(result).toBe('denied');
          } else if (profile === 'admin' && isAdminRoute) {
            expect(result).toBe('allowed');
          } else if (profile === 'beneficiario' && isBenefRoute) {
            expect(result).toBe('allowed');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
