import path from "path";
import { Client, GroupChat, Message, MessageMedia } from "whatsapp-web.js";

export default async function sendSticker(message: Message, client: Client) {
  let msg = message.body;
  let chat = await message.getChat();

  let [action, ...rest] = msg.split(' ');

  if (chat.isGroup) {
    let groupChat = chat as GroupChat;

    if (message.author?.includes('96217549') || message.mentionedIds.some(mention => `${mention}`.includes('96217549'))) {
      let pathFile = path.resolve('public', 'uploads', 'stickers', 'fuzeto.gif');
      var fuzeto = MessageMedia.fromFilePath(pathFile);
      groupChat.sendMessage(fuzeto, { sendMediaAsSticker: true });
    }
  }
}
