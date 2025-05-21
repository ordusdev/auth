import connection from '../connection';
import { KeycloakConstants } from '../constants';
import { SignInType } from '../types/signIn.type';
import { AuthUsecase } from './admin/auth.usecase';

export class SignInUsecase {
  async execute(data: SignInType) {
    try {
      const auth = await new AuthUsecase().execute();

      const response = await connection.post(
        '/realms/' + KeycloakConstants.REALM + '/protocol/openid-connect/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
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
      );

      return response.data;
    } catch (error) {
      console.error(
        {
          status: error.response.status,
          usecase: 'SignInUsecase',
        },
        Object.keys(error.response),
        error.response.data,
        error.request.data,
      );
    }
  }
}
