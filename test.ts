import { Keycloak } from '@ordus/auth'

async function run() {
  const createUser = new Keycloak.CreateUserUsecase()

  const result = await createUser.execute({
    username: 'test-user',
    enabled: true,
    password: '123456',
    isTemporaryPassword: false,
  })

  // console.log(result)
}

run().catch(console.error)
