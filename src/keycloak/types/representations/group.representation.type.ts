export type GroupRepresentationType = {
  id?: string
  name?: string
  path?: string
  subGroups?: GroupRepresentationType[]
  access?: Record<string, boolean>
  attributes?: Record<string, any>
  clientRoles?: Record<string, any>
  realmRoles?: string[]
}
