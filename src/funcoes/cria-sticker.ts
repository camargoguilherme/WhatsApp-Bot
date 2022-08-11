import WAWebJS, { MessageMedia } from "whatsapp-web.js";


export default async function criaSticker(message: WAWebJS.Message) {
	if (message.hasMedia) {
		try {
			// var sticker = await new MessageMedia('image/*', data.body);
			message.downloadMedia().then(async (media: MessageMedia) => {
				media.mimetype
				message.reply(media, undefined, { sendMediaAsSticker: true });
			});
		} catch (error) {
			throw new Error(`Erro ao criar Sticker: ${JSON.stringify(error)}`);
		}
	}
}
