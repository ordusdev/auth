import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants/keycloak.constant'
import { UpdateUserType } from '../types/updateUser.type'
import { AuthUsecase } from './admin/auth.usecase'
import { UserRepresentationType } from '../types/representations/user.representaion.type'

export class UpdateUserUsecase {
  async execute(data: UpdateUserType) {
    try {
      const auth = await new AuthUsecase().execute()
      // console.log('Update User KC ••• ')
      const realm = data.realm ?? KeycloakConstants.REALM

      const response = await connection.put<UserRepresentationType>(
        '/admin/realms/' + realm + '/users' + data.id,
        data,
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )
      // console.log('UpdateUser KC response ••• ', response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'UpdateUserUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in UpdateUserUsecase', error)
      }
    }
  }
}
