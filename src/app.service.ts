import { Injectable } from '@nestjs/common';
import {
  AssignGroupsToUserUsecase,
  CreateUserUsecase,
  GetGroupsUsecase,
  GetUsersUsecase,
  ResetPasswordUsecase,
  SignInUsecase,
  SignOutUsecase,
  UnassignGroupsToUserUsecase,
  UpdateUserUsecase,
} from '../libs/keycloak/src';
import { GetUserByEmailUsecase } from '../libs/keycloak/src/usecases/getUserByEmail.usecase';

@Injectable()
export class AppService {
  async getHello() {
    const createUserUsecase = new CreateUserUsecase();
    const getUserByEmailUsecase = new GetUserByEmailUsecase();
    const signInUsecase = new SignInUsecase();
    const signOutUsecase = new SignOutUsecase();
    const getUsersUsecase = new GetUsersUsecase();
    const resetPasswordUsecase = new ResetPasswordUsecase();
    const assignGroupsToUserUsecase = new AssignGroupsToUserUsecase();
    const unassignGroupsToUserUsecase = new UnassignGroupsToUserUsecase();
    const getGroupsUsecase = new GetGroupsUsecase();
    const updateUserUsecase = new UpdateUserUsecase();

    await createUserUsecase.execute({
      username: 'test4',
      email: 'email4@test.com',
      enabled: true,
      emailVerified: true,
      password: 'test4',
    });

    const userByEmail = (await getUserByEmailUsecase.execute('email4@test.com'))
      .data;

    const signIn = await signInUsecase.execute({
      username: 'test2',
      password: 'test2',
    });

    const groups = await getGroupsUsecase.execute();

    await assignGroupsToUserUsecase.execute({
      id: userByEmail.id,
      groups: groups.map((group) => group.id),
    });

    await unassignGroupsToUserUsecase.execute({
      id: userByEmail.id,
      groups: groups.map((group) => group.id),
    });

    await resetPasswordUsecase.execute({
      id: userByEmail.id,
      isTemporary: false,
      password: 'test4',
    });

    await updateUserUsecase.execute({
      id: userByEmail.id,
      firstName: 'TestQuatro',
      lastName: 'TestQuatro',
    });

    const users = await getUsersUsecase.execute({});

    await signOutUsecase.execute({
      refresh_token: signIn.data?.refresh_token,
    });

    return {
      userByEmail,
      signIn,
      users,
    };
  }
}
