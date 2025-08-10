import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
import { config } from 'dotenv'; config()
import { Client, Collection, GatewayIntentBits, Routes, REST} from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates
	]
});

client.commands = new Collection();
const commands = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
	const filePath = path.join(commandsPath, file);
	const command = await import(`file://${filePath}`);
	const data = command["default"]
	let isDisabled = data?.isDisabled ? data?.isDisabled : false
	if(isDisabled)
	{
		console.log(`Command is disabled : ${data.data.name}`);
		continue
	}
	if ('data' in data && 'execute' in data){
		client.commands.set(data.data.name, data);
		commands.push(data["data"].toJSON());
		continue
	}
	console.warn(`[UYARI] ${file} geçerli bir komut içermiyor (data & execute eksik).`);
}
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Slash komutlar yükleniyor...');
		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);
		console.log('Slash komutlar yüklendi.');
	} catch (error) {
		console.error(error);
	}
})();


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = await import(`file://${filePath}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


client.login(process.env.TOKEN);
