export class CreateUserType {
  username!: string
  password!: string
  isTemporaryPassword?: boolean
  realm?: string
  email?: string
  emailVerified?: boolean
  enabled?: boolean
  firstName?: string
  lastName?: string
  realmRoles?: string[]
  groups?: string[]
  attributes?: Record<string, any>
  clientRoles?: Record<string, any>
}
