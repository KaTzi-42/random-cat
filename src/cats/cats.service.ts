import { getRepository, Repository } from 'typeorm';
import { CatCreateDTO } from './cats.dto';
import { Cat } from './cats.entity';
import { FindCatOptions } from './findOptions';

export class CatService {
  private repository: Repository<Cat>;

  constructor() {
    this.repository = getRepository('cat');
  }

  create(dto: CatCreateDTO) {
    return this.repository.save(dto);
  }

  delete(id: number) {
    return this.repository.createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .returning('id, name')
      .execute();
  }

  update(dto: Partial<Cat>) {
    return this.repository.save(dto);
  }

  findById(id: number) {
    return this.repository.findOne(id);
  }

  async findAll() {
    const raw = await this.repository.createQueryBuilder('cat')
      .select('cat.id, cat.name, cat.type, cat.is_checked')
      .getRawMany();

    return this.rawToCats(raw);
  }

  async findByCondition(opt?: FindCatOptions) {
    const query = this.repository.createQueryBuilder('cat')
      .select('cat.id, cat.name, cat.type');

    if (opt) {
      if (opt.onValidation)
        query.addSelect('cat.is_checked');
      query.andWhere(`cat.is_checked = '${!opt.onValidation}'`);

      if (opt.type)
        query.andWhere(`cat.type = '${opt.type}'`);

      if (opt.sort)
        query.orderBy('cat.name', opt.sort);
    };

    const raw = await query.getRawMany();
    return this.rawToCats(raw);
  }

  private rawToCats(raw: any[]) {
    return raw.reduce((acc, cur) => {
      if (!acc[cur.type]) {
        acc[cur.type + 'Count'] = 1;
        acc[cur.type] = [cur];
      } else
        acc[cur.type + 'Count'] = acc[cur.type].push(cur);

      acc.catsCount++;
      return acc;
    }, { catsCount: 0 });
  }
}
