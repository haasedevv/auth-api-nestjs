import { InferIdType } from '@common/types/object-with-id.type';
import { Document, IfAny, Require_id } from 'mongoose';

export class MongoDocumentUtil {
  static transformDocumentToObjectWithId<T>(
    doc: Document<unknown> | IfAny<T, any, Document<unknown>> | null,
  ): InferIdType<T, string> | null {
    if (!doc) return null;

    const docObject = doc.toObject({ versionKey: false }) as Require_id<T>;

    const id = docObject._id;

    delete docObject._id;
    return { ...docObject, id: id } as InferIdType<T, string>;
  }
}
