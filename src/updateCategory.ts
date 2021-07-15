import Category from './models/Category';
interface ICategory {
  name?: string;
  _deletedAt?: number | null;
  words?: string;
  id?: string;
}
export async function updateCategory({
  name,
  _deletedAt,
  id,
  words,
}: ICategory) {
  const valuesToUpdate = {
    name,
    _deletedAt,
    words,
  };

  const omited = {};

  Object.keys(valuesToUpdate).forEach((item) => {
    if (typeof valuesToUpdate[item] !== 'undefined') {
      omited[item] = valuesToUpdate[item];
    }
  });

  const result = await Category.updateOne({ _id: id }, omited);
  return result;
}
