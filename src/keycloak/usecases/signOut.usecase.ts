import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { SignOutType } from '../types/signOut.type'
import { AuthUsecase } from './admin/auth.usecase'

export class SignOutUsecase {
  async execute(data: SignOutType) {
    try {
      const auth = await new AuthUsecase().execute()

      const response = await connection.post(
        '/realms/' +
          KeycloakConstants.REALM +
          '/protocol/openid-connect/logout',
        {
          refresh_token: data.refresh_token,
        },
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
            usecase: 'SignOutUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in SignOutUsecase', error)
      }
    }
  }
}
