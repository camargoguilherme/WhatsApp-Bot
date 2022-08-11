import { removeAcento } from './utils';
import giphy from 'giphy-api';
const clientGiphy = giphy(process.env.GIPHY_APY_KEY);

export default async function getImage(searchBy: string, type: 'gif' | 'sticker' | 'translate'): Promise<string> {
  searchBy = removeAcento(searchBy)
  let result;
  let urlImage = '';
  switch (type) {
    case 'gif':
      result = await clientGiphy.search({
        q: searchBy,
        rating: 'g',
        fmt: 'json',
        limit: 1,
      });
      urlImage = `https://i.giphy.com/media/${result['data'][0].id}/giphy.webp`;
      break;
    case 'sticker':
      result = await clientGiphy.random({
        rating: 'g',
        fmt: 'json',
        tag: searchBy
      });
      urlImage = `https://i.giphy.com/media/${result['data'].id}/giphy.webp`;
      break;

    case 'translate':
      result = await clientGiphy.translate({
        s: searchBy,
        rating: 'g',
        fmt: 'json',
      });
      urlImage = `https://i.giphy.com/media/${result['data'].id}/giphy.webp`;
      break;

    default:

  }
  return urlImage;
}
