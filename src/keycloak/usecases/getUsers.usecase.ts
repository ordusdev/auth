import axios from 'axios'
import connection from '../connection'
import { KeycloakConstants } from '../constants'
import { GetUsersType } from '../types/getUsers.type'
import { AuthUsecase } from './admin/auth.usecase'
import { UserRepresentationType } from '../types/representations/user.representaion.type'
import { GroupRepresentationType } from '../types/representations/group.representation.type'

export class GetUsersUsecase {
  async execute(data: GetUsersType) {
    try {
      const auth = await new AuthUsecase().execute()
      const params = []
      const realm = data.realm ?? KeycloakConstants.REALM

      if (data.id) {
        params.push('id=' + data.id)
      }
      if (data.username) {
        params.push('username=' + data.username)
      }
      if (data.email) {
        params.push('email=' + data.email)
      }
      if (data.firstName) {
        params.push('firstName=' + data.firstName)
      }
      if (data.lastName) {
        params.push('lastName=' + data.lastName)
      }
      if (data.search) {
        params.push('search=' + data.search)
      }

      const users = await connection.get<UserRepresentationType[]>(
        '/admin/realms/' + realm + '/users',
        {
          headers: {
            Authorization: 'Bearer ' + auth.data.access_token,
            'Content-Type': 'application/json',
          },
          params: params.join('&'),
        },
      )

      if (data.withGroups) {
        await Promise.all(
          users.data.map(async (user: any) => {
            const groups = await connection.get<GroupRepresentationType[]>(
              '/admin/realms/' + realm + '/users/' + user.id + '/groups',
              {
                headers: {
                  Authorization: 'Bearer ' + auth.data.access_token,
                  'Content-Type': 'application/json',
                },
              },
            )
            user.groups = groups.data
          }),
        )
      }

      return users.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'GetUsersUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in GetUsersUsecase', error)
      }
    }
  }
}
