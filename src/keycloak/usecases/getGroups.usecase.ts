import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { AuthUsecase } from './admin/auth.usecase'
import { GroupRepresentationType } from '../types/representations/group.representation.type'

export class GetGroupsUsecase {
  async execute(realm: string = KeycloakConstants.REALM) {
    try {
      const auth = await new AuthUsecase().execute()
      const groups = await connection.get<GroupRepresentationType[]>(
        '/admin/realms/' + realm + '/groups',
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )

      return groups.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'GetGroupsUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in GetGroupsUsecase', error)
      }
    }
  }
}
