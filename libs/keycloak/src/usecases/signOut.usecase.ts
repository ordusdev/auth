import connection from '../connection';
import { KeycloakConstants } from '../constants';
import { SignOutType } from '../types/signOut.type';
import { AuthUsecase } from './admin/auth.usecase';

export class SignOutUsecase {
  async execute(data: SignOutType) {
    try {
      const auth = await new AuthUsecase().execute();

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
      );

      return response.data;
    } catch (error) {
      console.error(
        {
          status: error.response.status,
          usecase: 'SignOutUsecase',
        },
        Object.keys(error.response),
        error.response.data,
        error.request.data,
      );
    }
  }
}
