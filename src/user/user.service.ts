import { hash } from 'bcrypt';
import { getRepository, Repository } from 'typeorm';
import { ConfigService } from '../common/config.service';
import { HttpError } from '../error/httpError';
import { UserCreateDTO } from './user.dto';
import { User } from './user.entity';


export class UserService {
  private repository: Repository<User>;

  constructor(private config: ConfigService,) {
    this.repository = getRepository('user');
  }

  async create({ password, ...dto }: UserCreateDTO) {
    const user = await this.findByEmail(dto.email);
    if (user)
      throw new HttpError(422, 'User already exists', { email: dto.email });

    const hashPassword = await hash(password, Number(this.config.get('SALT')));
    return this.repository.save({ password: hashPassword, ...dto });
  }

  delete(id: number) {
    return this.repository.createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .returning('id')
      .execute();
  }

  update(dto: Partial<User>) {
    return this.repository.save(dto);
  }

  findById(id: number) {
    return this.repository.findOne(id);
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }
}
