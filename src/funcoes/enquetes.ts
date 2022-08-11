import { removeAcento } from '../utils';
import { MessageMedia, List, Buttons, Client, Chat, GroupChat, Message } from 'whatsapp-web.js';


export default async function enquetes(message: Message, client: Client) {

  let msg = message.body;
  let chat = await message.getChat();
  let [action, ...rest] = msg.split(' ');

  let sections = [{
    title: 'sectionTitle', rows: [{ title: 'ListItem1', description: 'desc' }, { title: 'ListItem2' }]
  }];

  let list = new List('List body', 'btnText', sections, 'Title', 'footer');
  let button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');

  let option = removeAcento(rest.join('').toLocaleLowerCase()).trim()
  console.log(option)

  let contact = await message.getContact();

  switch (option) {
    case 'list':
      client.sendMessage(chat.id._serialized, list);
      break;
    case 'button':
      client.sendMessage(chat.id._serialized, button);
      break;
  }
}
