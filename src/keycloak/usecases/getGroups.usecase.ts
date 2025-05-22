import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { AuthUsecase } from './admin/auth.usecase'

export class GetGroupsUsecase {
  async execute() {
    try {
      const auth = await new AuthUsecase().execute()

      const groups = await connection.get(
        '/admin/realms/' + KeycloakConstants.REALM + '/groups',
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
