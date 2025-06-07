import { SortOrder } from 'mongoose';

export type FindAllOptions<T> = {
  select?: (keyof T)[];
  sort?: Record<string, SortOrder>;
  page?: number;
  limit?: number;
};
