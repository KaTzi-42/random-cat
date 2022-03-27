import { hash, compare } from 'bcrypt';
import { getRepository, Repository } from 'typeorm';
import { ConfigService } from '../common/config.service';
import { HttpError } from '../error/httpError';
import { UserCreateDTO, UserLoginDTO } from './user.dto';
import { User } from './user.entity';


export class UserService {
  private repository: Repository<User>;

  constructor(private config: ConfigService,) {
    this.repository = getRepository('user');
  }

  async create({ password, ...dto }: UserCreateDTO) {
    const user = await this.repository.findOne({ where: { email: dto.email } });
    if (user)
      throw new HttpError(422, 'User already exists', { email: dto.email });

    const hashPassword = await hash(password, this.config.get('SALT'));
    return this.repository.save({ password: hashPassword, ...dto });
  }

  async validate({ email, password }: UserLoginDTO) {
    const user = await this.repository.findOne({ where: { email } });
    if (!user)
      throw new HttpError(422, 'User not found', { email });

    return compare(password, user.password);
  }
}
