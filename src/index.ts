import { Client, MessageMedia, LocalAuth, Message, GroupNotification, LegacySessionAuth, ClientSession } from 'whatsapp-web.js';
import qrcode, { } from 'qrcode-terminal';
import comandos from './funcoes/comandos';
import criaSticker from './funcoes/cria-sticker';
import sendSticker from './funcoes/send-sticker';
import path from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const SESSION_FILE_PATH = path.resolve('public', 'sessions', 'session.json');

class WhatsAppBot {
	client: Client;
	qrCodeTerminal: any;
	constructor() {
		this.qrCodeTerminal = qrcode;
		this.client = new Client({
			authStrategy: new LocalAuth(),
			// authStrategy: new LegacySessionAuth({
			// 	session: JSON.parse(sessionData),
			// }),
			puppeteer: {
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--shm-size=3gb'
				]
			}
		});
		this.initialize();
	}

	async initialize() {
		try {
			this.client.initialize();

			this.client.on('qr', this.qrCode);
			this.client.on('ready', this.ready);
			this.client.on('message', (message) => this.message(message, this.client));
			this.client.on('group_join', (notification) => this.groupJoin(notification, this.client));
			this.client.on('group_leave', (notification) => this.groupLeave(notification, this.client));

		} catch (error) {
			throw new Error('Error ao inicializar: ' + error);
		}
	}


	qrCode(qr: string) {
		qrcode.generate(qr, { small: true });
	}

	ready() {
		console.log('✅ Bot pronto!');
	}

	async message(message: Message, client: Client) {
		try {
			await comandos(message, client);

			// Envia foto do fuzeto
			//await sendSticker(message, client);

			// Função para encaminhar notícias do JRMUNews
			message.getChat().then(chat => {
				if (chat.id._serialized == '5513982205403-1573824199@g.us') {
					message.forward('120363024197328942@g.us');
					return;
				}
			});
		} catch (error) {
			let user = {
				contact: message.author,
				group: {},
				message: message.body
			}
			const chat = await message.getChat();
			if (chat.isGroup) {
				user['group'] = chat.id;
			}

			client.sendMessage('120363047155217774@g.us', `${JSON.stringify(user, null, 2)}\n ${error}`);
			message.reply('Houve uma falha ao realizar a ação solicitada.');
		}
	}

	async groupJoin(notification: GroupNotification, client: Client) {
		if (notification.author != '13126679619@c.us') {
			client.sendMessage(notification.chatId, 'Fala novo integrante. Beleza?');
		}
	}

	async groupLeave(notification: GroupNotification, client: Client) {
		if (notification.author != '13126679619@c.us') {
			client.sendMessage(notification.chatId, 'Saiu pq é corno!!!');
		}
	}
}

module.exports = new WhatsAppBot();
