import CredentialRepresentation from './credential.representation.type'
import FederatedIdentityRepresentation from './federatedIdentity.representation.type'

export declare enum RequiredActionAlias {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  CONFIGURE_TOTP = 'CONFIGURE_TOTP',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  terms_and_conditions = 'terms_and_conditions',
}

export default interface UserConsentRepresentation {
  clientId?: string
  createDate?: string
  grantedClientScopes?: string[]
  lastUpdatedDate?: number
}

export type UserRepresentationType = {
  id?: string
  createdTimestamp?: number
  username?: string
  enabled?: boolean
  totp?: boolean
  emailVerified?: boolean
  disableableCredentialTypes?: string[]
  requiredActions?: RequiredActionAlias[]
  notBefore?: number
  access?: Record<string, boolean>
  attributes?: Record<string, any>
  clientConsents?: UserConsentRepresentation[]
  clientRoles?: Record<string, any>
  credentials?: CredentialRepresentation[]
  email?: string
  federatedIdentities?: FederatedIdentityRepresentation[]
  federationLink?: string
  firstName?: string
  groups?: string[]
  lastName?: string
  origin?: string
  realmRoles?: string[]
  self?: string
  serviceAccountClientId?: string
}
