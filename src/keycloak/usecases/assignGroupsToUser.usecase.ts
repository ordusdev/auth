import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants/keycloak.constant'
import { AssignGroupsToUserType } from '../types/assignGroupsToUser.type'
import { AuthUsecase } from './admin/auth.usecase'

export class AssignGroupsToUserUsecase {
  async execute(data: AssignGroupsToUserType) {
    try {
      const auth = await new AuthUsecase().execute()
      console.log('Assign Groups To User KC ••• ', auth.data.access_token)

      const response = await Promise.all(
        data.groups.map(async group => {
          const response = await connection.put(
            '/admin/realms/' +
              KeycloakConstants.REALM +
              '/groups/' +
              group +
              '/users/' +
              data.id,
            {},
            {
              headers: {
                Authorization: 'Bearer ' + auth.data.access_token,
                'Content-Type': 'application/json',
              },
            },
          )
          console.log('AssignGroupsToUser KC response ••• ', response.data)
          return response.data
        }),
      )

      await connection.put(
        '/admin/realms/' + KeycloakConstants.REALM + '/users' + data.id,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )

      return response
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'AssignGroupsToUserUsecase',
          },
          Object.keys(error.response),
          error.response.data,
          error.request?.data,
        )
      } else {
        console.error('Unknown error in AssignGroupsToUserUsecase', error)
      }
    }
  }
}
