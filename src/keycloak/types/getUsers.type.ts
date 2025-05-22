export class GetUsersType {
  id?: string;
  username?: string;
  email?: string;
  realm?: string
  firstName?: string;
  lastName?: string;
  search?: string; // busca por username, email, firstName ou lastName

  withGroups?: boolean; // trazer os grupos de cada usuario
}
