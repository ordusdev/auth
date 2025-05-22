import axios from 'axios'
import { ValidateTokenType } from '../types'
import { KeycloakConstants } from '../constants'
import connection from '../connection'

export class ValidateTokenUsecase {
  async execute(data: ValidateTokenType) {
    try {
      const realm = data.realm ?? KeycloakConstants.REALM
      const userInfo = await connection.get<void>(
        '/realms/' + realm + '/protocol/openid-connect/userinfo',
        {
          headers: {
            Authorization: 'Bearer ' + data.access_token,
            'Content-Type': 'application/json',
          },
        },
      )

      // console.log(
      //   'ValidateTokenUsecase userInfo.data ••• ',
      //   userInfo.data
      // )
      return userInfo.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          {
            status: error.response.status,
            usecase: 'ValidateTokenUsecase',
          },
          Object.keys(error.response),
          error.response.data,
        )
      } else {
        console.error('Unknown error in ValidateTokenUsecase', error)
      }
    }
  }
}
