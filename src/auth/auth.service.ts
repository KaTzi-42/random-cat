import { HttpError } from '../error/httpError';
import { UserCreateDTO, UserLoginDTO } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { Role } from '../user/user.entity';

export class AuthService {
  constructor(private userService: UserService) { }

  async register(userDTO: UserCreateDTO) {
    const { password, ...newUser } = await this.userService.create(userDTO);
    return newUser;
  }

  async validateUser({ email, password }: UserLoginDTO) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new HttpError(401, 'login error', 'login');

    const result = await compare(password, user.password);
    return { isValid: result, role: user.role };
  }
}
