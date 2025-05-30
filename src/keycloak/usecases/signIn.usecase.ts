import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { SignInType } from '../types/signIn.type'
import { AuthUsecase } from './admin/auth.usecase'
import { AuthRepresentationType } from '../types/representations/auth.representation.type'

export class SignInUsecase {
  async execute(data: SignInType) {
    try {
      const auth = await new AuthUsecase().execute()
      const realm = data.realm ?? KeycloakConstants.REALM

      const response = await connection.post<AuthRepresentationType>(
        '/realms/' + realm + '/protocol/openid-connect/token',
        new URLSearchParams({
          grant_type: 'password',
          client_id: KeycloakConstants.CLIENT_ID,
          client_secret: KeycloakConstants.CLIENT_SECRET,
          username: data.username,
          password: data.password,
        }),
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      console.log('SignIn KC response ••• ', response.data)

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'SignInUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in SignInUsecase', error)
      }
    }
  }
}
