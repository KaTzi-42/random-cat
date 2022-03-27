import { getRepository, Repository } from 'typeorm';
import { CatDTO } from './cats.dto';
import { Cat } from './cats.entity';
import { FindCatOptions } from './findOptions';

export class CatService {
  private repository: Repository<Cat>;

  constructor() {
    this.repository = getRepository('cat');
  }

  findById(id: number) {
    return this.repository.findOne(id);
  }

  async findAll(opt?: FindCatOptions) {
    const query = this.repository.createQueryBuilder('cat')
      .select('cat.id, cat.name, cat.type');

    if (opt) {
      if (opt.onValidation) {
        query.addSelect('cat.is_checked');
      }
      if (opt.onlyChecked)
        query.andWhere(`cat.is_checked = '${opt.onlyChecked}'`);
      if (opt.type) {
        query.andWhere(`cat.type = '${opt.type}'`);
      }
      if (opt.sort) {
        query.orderBy('cat.name', opt.sort);
      }
    };

    let cats: any = {};
    cats.catsCount = await query.getCount();
    const db = await query.getRawMany();

    cats = db.reduce((acc, cur) => {
      if (!acc[cur.type]) {
        acc[cur.type + 'Count'] = 1;
        acc[cur.type] = [cur];
      } else
        acc[cur.type + 'Count'] = acc[cur.type].push(cur);

      return acc;
    }, cats);

    return cats;
  }

  create(dto: CatDTO) {
    return this.repository.save(dto);
  }

  delete(id: number) {
    return this.repository.createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .returning('id, name')
      .execute();
  }
}
