import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants/keycloak.constant'
import { UnassignGroupsToUserType } from '../types/unassignGroupsToUser.type'
import { AuthUsecase } from './admin/auth.usecase'

export class UnassignGroupsToUserUsecase {
  async execute(data: UnassignGroupsToUserType) {
    try {
      const auth = await new AuthUsecase().execute()
      console.log('Unassign Groups To User KC ••• ', auth.data.access_token)

      const response = await Promise.all(
        data.groups.map(async group => {
          const groupExists = await connection.get(
            '/admin/realms/' + KeycloakConstants.REALM + '/groups/' + group,
            {
              headers: {
                Authorization: 'Bearer ' + auth.data.access_token,
                'Content-Type': 'application/json',
              },
            },
          )

          if (groupExists.data.length === 0) {
            throw new Error(`Group #${group} does not exist`)
          }
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
          )
          console.log('UnassignGroupsToUser KC response ••• ', response.data)
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
            usecase: 'UnassignGroupsToUserUsecase',
          },
          Object.keys(error.response),
          error.response.data,
          error.request?.data,
        )
      } else {
        console.error('Unknown error in UnassignGroupsToUserUsecase', error)
      }
    }
  }
}
