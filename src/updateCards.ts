import Cards from './models/Cards';

interface ICategory {
  name?: string;
  categoryName?: string;
  translation?: string;
  _deletedAt?: number | null;
  sound?: string;
  img?: string;
  id?: string;
}
export async function updateCards({
  name,
  categoryName,
  translation,
  sound,
  img,
  _deletedAt,
  id,
}: ICategory) {
  const valuesToUpdate = {
    name,
    categoryName,
    translation,
    sound,
    img,
    _deletedAt,
  };

  const omited = {};

  Object.keys(valuesToUpdate).forEach((item) => {
    if (typeof valuesToUpdate[item] !== 'undefined') {
      omited[item] = valuesToUpdate[item];
    }
  });

  const result = await Cards.updateOne({ _id: id }, omited);
  return result;
}
