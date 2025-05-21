import connection from '../../connection'
import { KeycloakConstants } from '../../constants'

export class AuthUsecase {
  async execute() {
    return connection.post(
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
  }
}
