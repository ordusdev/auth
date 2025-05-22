export class UpdateUserType {
  id!: string
  username?: string
  enabled?: boolean
  emailVerified?: boolean
  firstName?: string
  lastName?: string
  email?: string
  notBefore?: number
  realm?: string
  access?: {
    manageGroupMembership?: boolean
    view?: boolean
    mapRoles?: boolean
    impersonate?: boolean
    manage?: boolean
  }
  attributes?: Record<string, any>
  groups?: string[]
  clientRoles?: Record<string, any>
}
