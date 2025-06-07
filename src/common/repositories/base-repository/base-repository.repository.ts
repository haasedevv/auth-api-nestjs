import { IBaseRepository } from '@/common/interfaces/base-repository.interface';
import { FindAllOptions } from '@/common/repositories/base-repository/types/find-all-options.type';
import { InferIdType } from '@/common/types/object-with-id.type';
import { MongoDocumentUtil } from '@/common/utils/mongo-document.util';
import { Model } from 'mongoose';

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>, select?: (keyof T)[]): Promise<InferIdType<T, string> | null> {
    const createdDocument = new this.model(data);

    const doc = await createdDocument.save();

    if (!select?.length || !doc) return MongoDocumentUtil.transformDocumentToObjectWithId<T>(doc);

    return this.findById(doc._id as string, select);
  }

  async deleteById(id: string, select?: (keyof T)[]): Promise<InferIdType<T, string> | null> {
    const query = this.model.findByIdAndDelete(id);

    if (select?.length) query.select(select.join(' '));

    const doc = await query.exec();
    return MongoDocumentUtil.transformDocumentToObjectWithId<T>(doc);
  }

  async updateById(
    id: string,
    data: Partial<T>,
    select?: (keyof T)[],
  ): Promise<InferIdType<T, string> | null> {
    const query = this.model.findByIdAndUpdate(id, data);

    if (select?.length) query.select(select.join(' '));

    const doc = await query.exec();
    return MongoDocumentUtil.transformDocumentToObjectWithId<T>(doc);
  }

  async findById(id: string, select?: (keyof T)[]): Promise<InferIdType<T, string> | null> {
    const query = this.model.findById(id);

    if (select?.length) query.select(select.join(' '));

    const doc = await query.exec();

    return MongoDocumentUtil.transformDocumentToObjectWithId<T>(doc);
  }

  async findAll({
    select,
    page = 1,
    limit,
    sort,
  }: FindAllOptions<T>): Promise<InferIdType<T, string>[]> {
    const query = this.model.find();

    if (select?.length) query.select(select.join(' '));
    if (sort) query.sort(sort);
    if (limit) query.limit(limit).skip((page - 1) * limit);

    const docs = await query.exec();
    return docs.map<InferIdType<T, string>>(
      doc => MongoDocumentUtil.transformDocumentToObjectWithId<T>(doc)!,
    );
  }
}
