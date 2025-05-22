import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants/keycloak.constant'
import { ResetPasswordType } from '../types/resetPassword.type'
import { AuthUsecase } from './admin/auth.usecase'

export class ResetPasswordUsecase {
  async execute(data: ResetPasswordType) {
    try {
      const auth = await new AuthUsecase().execute()
      console.log('Reset Password KC ••• ')

      const response = await connection.put(
        '/admin/realms/' + KeycloakConstants.REALM + '/users' + data.id,
        {
          credentials: [
            {
              type: 'password',
              value: data.password,
              temporary: data.isTemporary,
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
      console.log('ResetPassword KC response ••• ', response.data)
      return response
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'ResetPasswordUsecase',
          },
          Object.keys(error.response),
          error.response.data,
          error.request?.data,
        )
      } else {
        console.error('Unknown error in ResetPasswordUsecase', error)
      }
    }
  }
}
