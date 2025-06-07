import { FindAllOptions } from '@/common/repositories/base-repository/types/find-all-options.type';
import { InferIdType } from '@common/types/object-with-id.type';

export interface IBaseRepository<T> {
  create(data: Partial<T>, select?: (keyof T)[]): Promise<InferIdType<T, string> | null>;
  deleteById(id: string, select?: (keyof T)[]): Promise<InferIdType<T, string> | null>;
  updateById(
    id: string,
    data: Partial<T>,
    select?: (keyof T)[],
  ): Promise<InferIdType<T, string> | null>;
  findById(id: string, select?: (keyof T)[]): Promise<InferIdType<T, string> | null>;
  findAll(options: FindAllOptions<T>): Promise<InferIdType<T, string>[]>;
}
