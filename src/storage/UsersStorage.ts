interface UserData {
  name: string;
  password: string;
  id: string;
}

class UsersStorage {
  private users: UserData[];

  constructor(data: UserData[]) {
    this.users = data;
  }

  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find((userData) => userData.id === id);
  }

  addUser(users: UserData) {
    this.users.push(users);
  }

  isUserExist(name: string) {
    return this.users.find((userData) => userData.name === name);
  }
}

const users = new UsersStorage([]);

export default users;
