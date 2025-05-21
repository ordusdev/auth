import connection from '../connection';
import { KeycloakConstants } from '../constants/keycloak.constant';
import { UnassignGroupsToUserType } from '../types/unassignGroupsToUser.type';
import { AuthUsecase } from './admin/auth.usecase';

export class UnassignGroupsToUserUsecase {
  async execute(data: UnassignGroupsToUserType) {
    try {
      const auth = await new AuthUsecase().execute();
      console.log('Unassign Groups To User KC ••• ', auth.data.access_token);

      const response = await Promise.all(
        data.groups.map(async (group) => {
          const response = await connection.delete(
            '/admin/realms/' +
              KeycloakConstants.REALM +
              '/groups/' +
              group +
              '/users/' +
              data.id,
            {
              headers: {
                Authorization: 'Bearer ' + auth.data.access_token,
                'Content-Type': 'application/json',
              },
            },
          );
          console.log('UnassignGroupsToUser KC response ••• ', response.data);
          return response.data;
        }),
      );

      await connection.put(
        '/admin/realms/' + KeycloakConstants.REALM + '/users' + data.id,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      );

      return response;
    } catch (error) {
      console.error(
        {
          status: error.response.status,
          usecase: 'UnassignGroupsToUserUsecase',
        },
        Object.keys(error.response),
        error.response.data,
        error.request.data,
      );
    }
  }
}
