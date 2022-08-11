import { removeAcento } from './utils';
import { Cheerio, Element, load } from 'cheerio';
import axios from 'axios';
import request from 'request';

export default async function getAudio(searchBy: string) {
  searchBy = removeAcento(searchBy)

  const link = `https://www.myinstants.com/en/search/?name=${searchBy.replace(/ /g, '+')}`;
  let link_audio = '';
  const { data, status } = await axios.get(link).catch(res => res.response);

  let $ = load(data);

  let content;
  if (status > 400) {
    const { data, status } = await axios.get('https://www.myinstants.com/en/recommendations').catch(res => res.response);
    $ = load(data);
    let lenght = Math.floor(Math.random() * $('.instant > button').length)
    content = $($('.instant > button').get(lenght)).attr();
  } else {
    content = $('#instants_container > .instant > button').first().attr();
  }

  let links = content as Record<string, string>;

  if (content != null) {
    let [_, play, ...rest] = links['onclick'].split('\'');
    link_audio = `https://www.myinstants.com${play}`;
    // console.log(link_audio)
  }
  return link_audio;
}
