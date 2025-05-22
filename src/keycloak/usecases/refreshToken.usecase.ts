import axios from 'axios'
import connection from '../connection'
import { RefreshTokenType } from '../types'
import { AuthUsecase } from './admin/auth.usecase'
import { KeycloakConstants } from '../constants'
import { AuthRepresentationType } from '../types/representations/auth.representation.type'

export class RefreshTokenUsecase {
  async execute(data: RefreshTokenType) {
    try {
      const auth = await new AuthUsecase().execute()
      // console.log('Refresh Token KC ••• ')
      const realm = data.realm ?? KeycloakConstants.REALM

      const response = await connection.post<AuthRepresentationType>(
        '/realms/' + realm + '/protocol/openid-connect/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: data.refresh_token,
          client_id: KeycloakConstants.CLIENT_ID,
          client_secret: KeycloakConstants.CLIENT_SECRET,
        }),
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      // console.log('RefreshToken KC response ••• ', response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'RefreshTokenUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in RefreshTokenUsecase', error)
      }
    }
  }
}
