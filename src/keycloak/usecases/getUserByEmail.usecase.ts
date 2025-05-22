import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { AuthUsecase } from './admin/auth.usecase'

export class GetUserByEmailUsecase {
  async execute(email: string) {
    try {
      const auth = await new AuthUsecase().execute()
      return connection.get(
        '/admin/realms/' + KeycloakConstants.REALM + '/users?email=' + email,
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'GetUserByEmailUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in GetUserByEmailUsecase', error)
      }
    }
  }
}
