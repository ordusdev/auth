import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants/keycloak.constant'
import { ResetPasswordType } from '../types/resetPassword.type'
import { AuthUsecase } from './admin/auth.usecase'
import { AuthRepresentationType } from '../types/representations/auth.representation.type'

export class ResetPasswordUsecase {
  async execute(data: ResetPasswordType) {
    try {
      const auth = await new AuthUsecase().execute()
      // console.log('Reset Password KC ••• ')
      const realm = data.realm ?? KeycloakConstants.REALM

      const response = await connection.put<AuthRepresentationType>(
        '/admin/realms/' + realm + '/users' + data.id + '/reset-password',
        {
          type: 'password',
          value: data.password,
          temporary: data.isTemporary,
        },
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )
      // console.log('ResetPassword KC response ••• ', response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'ResetPasswordUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in ResetPasswordUsecase', error)
      }
    }
  }
}
