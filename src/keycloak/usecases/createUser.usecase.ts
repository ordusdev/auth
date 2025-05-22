import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants/keycloak.constant'
import { CreateUserType } from '../types/createUser.type'
import { AuthUsecase } from './admin/auth.usecase'

export class CreateUserUsecase {
  async execute(data: CreateUserType) {
    try {
      const auth = await new AuthUsecase().execute()
      console.log('Create User KC ••• ')

      const password = data.password
      const isTemporaryPassword = data.isTemporaryPassword
      delete (data as any).password
      delete data.isTemporaryPassword

      const response = await connection.post(
        '/admin/realms/' + KeycloakConstants.REALM + '/users',
        {
          ...data,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: isTemporaryPassword,
            },
          ],
        },
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('CreateUser KC response ••• ', response.data)
      return response
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'CreateUserUsecase',
          },
          Object.keys(error.response),
          error.response.data,
          error.request?.data,
        )
      } else {
        console.error('Unknown error in CreateUserUsecase', error)
      }
    }
  }
}
