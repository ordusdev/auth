import connection from '../../connection'
import { KeycloakConstants } from '../../constants'
import { AuthRepresentationType } from '../../types/representations/auth.representation.type'

export class AuthUsecase {
  async execute() {
    const response = await connection.post<AuthRepresentationType>(
      '/realms/' + KeycloakConstants.REALM + '/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: KeycloakConstants.CLIENT_ID,
        client_secret: KeycloakConstants.CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    // console.log('Auth KC response ••• ', response.data)

    return response
  }
}
