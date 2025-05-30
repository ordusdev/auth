import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { AuthUsecase } from './admin/auth.usecase'
import { GetUserByEmailType } from '../types'
import { UserRepresentationType } from '../types/representations/user.representaion.type'

export class GetUserByEmailUsecase {
  async execute(data: GetUserByEmailType) {
    try {
      const auth = await new AuthUsecase().execute()
      const realm = data.realm ?? KeycloakConstants.REALM
      const response = await connection.get<UserRepresentationType>(
        '/admin/realms/' + realm + '/users?email=' + data.email,
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data
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
