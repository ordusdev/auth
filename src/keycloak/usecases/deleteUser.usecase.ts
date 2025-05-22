import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { AuthUsecase } from './admin/auth.usecase'
import { DeleteUserType } from '../types/deleteUser.type'

export class DeleteUserUsecase {
  async execute(data: DeleteUserType) {
    try {
      const auth = await new AuthUsecase().execute()
      const realm = data.realm ?? KeycloakConstants.REALM
      const response = await connection.delete<void>(
        '/admin/realms/' + realm + '/users/' + data.id,
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
            usecase: 'DeleteUserUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in DeleteUserUsecase', error)
      }
    }
  }
}
