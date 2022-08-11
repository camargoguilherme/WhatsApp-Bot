import { removeAcento } from '../utils';
import { MessageMedia, List, Buttons, Client, Chat, GroupChat, Message } from 'whatsapp-web.js';
import getAudio from '../get-audio';
import path from 'path';
import getImage from '../get-image';
import enquetes from './enquetes';

export default async function comandos(message: Message, client: Client) {

  let msg = message.body;
  let chat = await message.getChat();
  let [action, ...rest] = msg.split(' ');

  // if (chat.isGroup) {
  //   const authorId = message.author;
  //   for(let participant of chat.participants) {
  //     if(participant.id._serialized === authorId && !participant.isAdmin) {
  //                         // Here you know they are not an admin
  //       message.reply(`O comando \`\`\`${this.name}\`\`\` apenas pode ser usado por admins.`);
  //       break;
  //     }
  //   }
  // }

  let messageHelp = [
    '*/echo* - Retorna mensagem enviada',
    '_*/echo* teste_',
    '',
    '*/audio* - Retorna um audio',
    '_*/audio* ai que dilicia_',
    '',
    '*/gif* - Retorna um gif',
    '_*/gif* o mascara_',
    '',
    '*/sticker* - Retorna um sticker',
    '_*/sticker* timão e pumba_',
    '',
    '*/imagem* - Retorna uma imagem',
    '_*/imagem* luz e sombra_',
    '',
    '*/figurinha* - Retorna uma figurinha da imagem ou video enviado',
    '',
    '*/all* - Manda uma mensagem e marca todos do grupo',
    '_*/all* Hoje tem arroz doce_',
    '',
  ].join('\n');

  let sections = [{
    title: 'sectionTitle', rows: [{ title: 'ListItem1', description: 'desc' }, { title: 'ListItem2' }]
  }];

  let list = new List('List body', 'btnText', sections, 'Title', 'footer');
  let button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');



  if (removeAcento(action.toLocaleLowerCase()).includes('/')) {
    switch (removeAcento(action.toLocaleLowerCase()).trim()) {
      case '/echo':
        client.sendMessage(message.from, rest.join(' '));
        break;
      case '/audio':
        let urlAudio = await getAudio(rest.join(' '));
        var audio = await MessageMedia.fromUrl(urlAudio);

        message.reply(audio, undefined, { sendAudioAsVoice: true });
        break;
      case '/gif':
        let urlImageGif = await getImage(rest.join(' '), 'gif');
        var imageGif = await MessageMedia.fromUrl(urlImageGif);
        message.reply(imageGif, undefined, { sendMediaAsSticker: true });
        break;
      case '/sticker':
        let urlImageSticker = await getImage(rest.join(' '), 'sticker');
        var imageSticker = await MessageMedia.fromUrl(urlImageSticker);
        message.reply(imageSticker, undefined, { sendMediaAsSticker: true });
        break;
      case '/imagem':
        let randomBoolean = Math.random() < 0.65;
        if (randomBoolean && ['fuzeto', 'mae japones', 'mae do japones'].some(item => removeAcento(rest.join(' ')).includes(item))) {
          let file = path.resolve('public', 'uploads', 'stickers', 'mae.jpeg');
          var mae = MessageMedia.fromFilePath(file);
          message.reply(mae, undefined, { sendMediaAsSticker: false });
          break;
        }

        let urlImage = await getImage(rest.join(' '), 'translate');
        var image = await MessageMedia.fromUrl(urlImage);

        message.reply(image, undefined, { sendMediaAsSticker: false });
        break;
      case '/help':
        message.reply(messageHelp);
        break;
      // case '/enquete':
      //   await enquetes(message, client);
      //   break;
      case '/all':
        if (chat.isGroup) {
          let groupChat = chat as GroupChat;

          let messageToGroup = rest.join(' ').trim()

          let text = ` 🚨 *${messageToGroup || 'Chamando todos!'}* 🚨 \n`;
          let mentions = [];

          for (let participant of groupChat.participants) {
            const contact = await client.getContactById(participant.id._serialized);

            mentions.push(contact);
            text += `\n @${participant.id.user} `;
          }
          message.reply(text, undefined, { mentions })
          break;
        }
        message.reply(`Comando _/all_ apenas pode ser usado em grupos`);
        break;
      case '/figurinha':
        if (message.hasMedia) {
          try {
            // var sticker = await new MessageMedia('image/*', data.body);
            message.downloadMedia().then(async (media: MessageMedia) => {
              media.mimetype
              message.reply(media, undefined, { sendMediaAsSticker: true });
            });
            break;
          } catch (error) {
            throw new Error(`Erro ao criar Sticker: ${JSON.stringify(error)}`);
          }
        } else {
          message.reply(`Envie um video ou uma imagem...`);
          break;
        }
      // case '/info':
      //   if (chat.isGroup) {
      //     const contact = await message.getContact();
      //     const chat = await message.getChat();
      //     chat.sendMessage(
      //       [`@${contact.number}`,
      //         `*Detalhes do Grupo*`,
      //       `_*Nome*_: ${chat.name}`,
      //       `_*Descriição*_: ${chat.}\n`,
      //       `_*Criado em*_: ${chat.createdAt.toString()}`,
      //       //`_*Criado Por*_: ${chat.owner}`,
      //       `_*Quantidades de participante*_: ${chat.participants.length}`,
      //       ].join('\n'), {
      //       mentions: [contact],
      //     });
      //     return
      //   }
      //   message.reply(`Comando _/info_ apenas pode ser usado em grupos`);
      //   break;
      default:
        message.reply(messageHelp);
    }
  }
}
