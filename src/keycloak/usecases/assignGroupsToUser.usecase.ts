import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants/keycloak.constant'
import { AssignGroupsToUserType } from '../types/assignGroupsToUser.type'
import { AuthUsecase } from './admin/auth.usecase'
import { GroupRepresentationType } from '../types/representations/group.representation.type'

export class AssignGroupsToUserUsecase {
  async execute(data: AssignGroupsToUserType) {
    try {
      const auth = await new AuthUsecase().execute()
      // console.log('Assign Groups To User KC ••• ')
      const realm = data.realm ?? KeycloakConstants.REALM

      const response = await Promise.all(
        data.groups.map(async group => {
          const groupExists = await connection.get<GroupRepresentationType[]>(
            '/admin/realms/' + realm + '/groups/' + group,
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
          const response = await connection.put(
            '/admin/realms/' + realm + '/users/' + data.id + '/groups/' + group,
            {},
            {
              headers: {
                Authorization: 'Bearer ' + auth.data.access_token,
                'Content-Type': 'application/json',
              },
            },
          )
          // console.log('AssignGroupsToUser KC response ••• ', response.data)
          return response.data
        }),
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
        )
      } else {
        console.error('Unknown error in AssignGroupsToUserUsecase', error)
      }
    }
  }
}
