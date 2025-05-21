import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants/keycloak.constant'
import { UpdateUserType } from '../types/updateUser.type'
import { AuthUsecase } from './admin/auth.usecase'

export class UpdateUserUsecase {
  async execute(data: UpdateUserType) {
    try {
      const auth = await new AuthUsecase().execute()
      console.log('Update User KC ••• ', auth.data.access_token)

      const response = await connection.put(
        '/admin/realms/' + KeycloakConstants.REALM + '/users' + data.id,
        data,
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('UpdateUser KC response ••• ', response.data)
      return response
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'UpdateUserUsecase',
          },
          Object.keys(error.response),
          error.response.data,
          error.request?.data,
        )
      } else {
        console.error('Unknown error in UpdateUserUsecase', error)
      }
    }
  }
}
