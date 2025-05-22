import axios from 'axios'
import { TokenExchangeType } from '../types/tokenExchange.type'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { AuthUsecase } from './admin/auth.usecase'
import { AuthRepresentationType } from '../types/representations/auth.representation.type'

export class TokenExchangeUsecase {
  async execute(data: TokenExchangeType) {
    try {
      const auth = await new AuthUsecase().execute()
      const realm = data.realm ?? KeycloakConstants.REALM

      const response = await connection.post<AuthRepresentationType>(
        '/realms/' + realm + '/protocol/openid-connect/token',
        new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
          subject_token: auth.data.access_token,
          requested_subject: data.userId,
          audience: KeycloakConstants.CLIENT_ID,
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

      // console.log('TokenExchange KC response ••• ', response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'TokenExchangeUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in TokenExchangeUsecase', error)
      }
    }
  }
}
