/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthImport } from './routes/_auth'
import { Route as AuthIndexImport } from './routes/_auth/index'
import { Route as AuthSettingsImport } from './routes/_auth/settings'
import { Route as AuthPumpIndexImport } from './routes/_auth/pump/index'
import { Route as AuthDashboardIndexImport } from './routes/_auth/dashboard/index'
import { Route as AuthCustomersIndexImport } from './routes/_auth/customers/index'
import { Route as AuthPumpUnitlistImport } from './routes/_auth/pump/unit_list'
import { Route as AuthPumpUniteditImport } from './routes/_auth/pump/unit_edit'
import { Route as AuthPumpLovlistImport } from './routes/_auth/pump/lov_list'
import { Route as AuthPumpLoveditImport } from './routes/_auth/pump/lov_edit'
import { Route as AuthPumpListeditImport } from './routes/_auth/pump/list_edit'
import { Route as AuthPumpEngineeringImport } from './routes/_auth/pump/engineering'
import { Route as AuthPumpDetailImport } from './routes/_auth/pump/detail'
import { Route as AuthCustomersDashboardImport } from './routes/_auth/customers/dashboard'
import { Route as AuthAnalyticModelImport } from './routes/_auth/analytic.$model'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  path: '/',
  getParentRoute: () => AuthRoute,
} as any)

const AuthSettingsRoute = AuthSettingsImport.update({
  path: '/settings',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPumpIndexRoute = AuthPumpIndexImport.update({
  path: '/pump/',
  getParentRoute: () => AuthRoute,
} as any)

const AuthDashboardIndexRoute = AuthDashboardIndexImport.update({
  path: '/dashboard/',
  getParentRoute: () => AuthRoute,
} as any)

const AuthCustomersIndexRoute = AuthCustomersIndexImport.update({
  path: '/customers/',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPumpUnitlistRoute = AuthPumpUnitlistImport.update({
  path: '/pump/unit_list',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPumpUniteditRoute = AuthPumpUniteditImport.update({
  path: '/pump/unit_edit',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPumpLovlistRoute = AuthPumpLovlistImport.update({
  path: '/pump/lov_list',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPumpLoveditRoute = AuthPumpLoveditImport.update({
  path: '/pump/lov_edit',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPumpListeditRoute = AuthPumpListeditImport.update({
  path: '/pump/list_edit',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPumpEngineeringRoute = AuthPumpEngineeringImport.update({
  path: '/pump/engineering',
  getParentRoute: () => AuthRoute,
} as any)

const AuthPumpDetailRoute = AuthPumpDetailImport.update({
  path: '/pump/detail',
  getParentRoute: () => AuthRoute,
} as any)

const AuthCustomersDashboardRoute = AuthCustomersDashboardImport.update({
  path: '/customers/dashboard',
  getParentRoute: () => AuthRoute,
} as any)

const AuthAnalyticModelRoute = AuthAnalyticModelImport.update({
  path: '/analytic/$model',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/settings': {
      id: '/_auth/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthSettingsImport
      parentRoute: typeof AuthImport
    }
    '/_auth/': {
      id: '/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof AuthImport
    }
    '/_auth/analytic/$model': {
      id: '/_auth/analytic/$model'
      path: '/analytic/$model'
      fullPath: '/analytic/$model'
      preLoaderRoute: typeof AuthAnalyticModelImport
      parentRoute: typeof AuthImport
    }
    '/_auth/customers/dashboard': {
      id: '/_auth/customers/dashboard'
      path: '/customers/dashboard'
      fullPath: '/customers/dashboard'
      preLoaderRoute: typeof AuthCustomersDashboardImport
      parentRoute: typeof AuthImport
    }
    '/_auth/pump/detail': {
      id: '/_auth/pump/detail'
      path: '/pump/detail'
      fullPath: '/pump/detail'
      preLoaderRoute: typeof AuthPumpDetailImport
      parentRoute: typeof AuthImport
    }
    '/_auth/pump/engineering': {
      id: '/_auth/pump/engineering'
      path: '/pump/engineering'
      fullPath: '/pump/engineering'
      preLoaderRoute: typeof AuthPumpEngineeringImport
      parentRoute: typeof AuthImport
    }
    '/_auth/pump/list_edit': {
      id: '/_auth/pump/list_edit'
      path: '/pump/list_edit'
      fullPath: '/pump/list_edit'
      preLoaderRoute: typeof AuthPumpListeditImport
      parentRoute: typeof AuthImport
    }
    '/_auth/pump/lov_edit': {
      id: '/_auth/pump/lov_edit'
      path: '/pump/lov_edit'
      fullPath: '/pump/lov_edit'
      preLoaderRoute: typeof AuthPumpLoveditImport
      parentRoute: typeof AuthImport
    }
    '/_auth/pump/lov_list': {
      id: '/_auth/pump/lov_list'
      path: '/pump/lov_list'
      fullPath: '/pump/lov_list'
      preLoaderRoute: typeof AuthPumpLovlistImport
      parentRoute: typeof AuthImport
    }
    '/_auth/pump/unit_edit': {
      id: '/_auth/pump/unit_edit'
      path: '/pump/unit_edit'
      fullPath: '/pump/unit_edit'
      preLoaderRoute: typeof AuthPumpUniteditImport
      parentRoute: typeof AuthImport
    }
    '/_auth/pump/unit_list': {
      id: '/_auth/pump/unit_list'
      path: '/pump/unit_list'
      fullPath: '/pump/unit_list'
      preLoaderRoute: typeof AuthPumpUnitlistImport
      parentRoute: typeof AuthImport
    }
    '/_auth/customers/': {
      id: '/_auth/customers/'
      path: '/customers'
      fullPath: '/customers'
      preLoaderRoute: typeof AuthCustomersIndexImport
      parentRoute: typeof AuthImport
    }
    '/_auth/dashboard/': {
      id: '/_auth/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AuthDashboardIndexImport
      parentRoute: typeof AuthImport
    }
    '/_auth/pump/': {
      id: '/_auth/pump/'
      path: '/pump'
      fullPath: '/pump'
      preLoaderRoute: typeof AuthPumpIndexImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthRoute: AuthRoute.addChildren({
    AuthSettingsRoute,
    AuthIndexRoute,
    AuthAnalyticModelRoute,
    AuthCustomersDashboardRoute,
    AuthPumpDetailRoute,
    AuthPumpEngineeringRoute,
    AuthPumpListeditRoute,
    AuthPumpLoveditRoute,
    AuthPumpLovlistRoute,
    AuthPumpUniteditRoute,
    AuthPumpUnitlistRoute,
    AuthCustomersIndexRoute,
    AuthDashboardIndexRoute,
    AuthPumpIndexRoute,
  }),
  LoginRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/login"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/settings",
        "/_auth/",
        "/_auth/analytic/$model",
        "/_auth/customers/dashboard",
        "/_auth/pump/detail",
        "/_auth/pump/engineering",
        "/_auth/pump/list_edit",
        "/_auth/pump/lov_edit",
        "/_auth/pump/lov_list",
        "/_auth/pump/unit_edit",
        "/_auth/pump/unit_list",
        "/_auth/customers/",
        "/_auth/dashboard/",
        "/_auth/pump/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_auth/settings": {
      "filePath": "_auth/settings.tsx",
      "parent": "/_auth"
    },
    "/_auth/": {
      "filePath": "_auth/index.tsx",
      "parent": "/_auth"
    },
    "/_auth/analytic/$model": {
      "filePath": "_auth/analytic.$model.tsx",
      "parent": "/_auth"
    },
    "/_auth/customers/dashboard": {
      "filePath": "_auth/customers/dashboard.tsx",
      "parent": "/_auth"
    },
    "/_auth/pump/detail": {
      "filePath": "_auth/pump/detail.tsx",
      "parent": "/_auth"
    },
    "/_auth/pump/engineering": {
      "filePath": "_auth/pump/engineering.tsx",
      "parent": "/_auth"
    },
    "/_auth/pump/list_edit": {
      "filePath": "_auth/pump/list_edit.tsx",
      "parent": "/_auth"
    },
    "/_auth/pump/lov_edit": {
      "filePath": "_auth/pump/lov_edit.tsx",
      "parent": "/_auth"
    },
    "/_auth/pump/lov_list": {
      "filePath": "_auth/pump/lov_list.tsx",
      "parent": "/_auth"
    },
    "/_auth/pump/unit_edit": {
      "filePath": "_auth/pump/unit_edit.tsx",
      "parent": "/_auth"
    },
    "/_auth/pump/unit_list": {
      "filePath": "_auth/pump/unit_list.tsx",
      "parent": "/_auth"
    },
    "/_auth/customers/": {
      "filePath": "_auth/customers/index.tsx",
      "parent": "/_auth"
    },
    "/_auth/dashboard/": {
      "filePath": "_auth/dashboard/index.tsx",
      "parent": "/_auth"
    },
    "/_auth/pump/": {
      "filePath": "_auth/pump/index.tsx",
      "parent": "/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
