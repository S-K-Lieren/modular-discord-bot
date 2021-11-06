import { Channel, Client, Guild, MessageEmbed, TextBasedChannels, TextChannel } from 'discord.js';

export interface EmbedInfo {
    img: string,
    thumbnail: string
    url: string
};

export class Util {
    static async sendMessageToChannel(client: Client, channelID: string, msg: string, embed?: EmbedInfo): Promise<void> {
        const channel: Channel | null = await Util.getChannelByID(client, channelID);

        if (channel && channel.isText()) {
            if (!embed) {
                channel.send(msg);

                return;
            }

            Util.sendEmbedMessage(channel, msg, { info: embed });

        }
    }

    static channelMentionToID(mention: string): string | undefined {
        const regex: RegExp = new RegExp(/<#(\d+)>/gm);

        if (!regex.test(mention)) {
            return undefined;
        }

        return mention.replace('<', '').replace('>', '').replace('#', '');
    }

    static isValidChannel(guild: Guild, channelID: string, onlyText?: boolean): boolean {
        if (!guild?.channels.cache.has(channelID)) {
            return false;
        }

        if (onlyText && !guild.channels.cache.get(channelID)?.isText) {
            return false;
        }

        return true;
    }

    static async sendEmbedMessage(channel: TextBasedChannels | TextChannel | Channel | string | null, msg: string, embed: { info?: EmbedInfo, embed?: MessageEmbed }, client?: Client, pingText?: string): Promise<void> {

        if (!channel) {
            return;
        }

        if (typeof channel === 'string') {
            if (!client) {
                return;
            }
            channel = await Util.getChannelByID(client, channel);
        }

        if (!channel || !channel.isText()) {
            return;
        }

        let e: MessageEmbed;

        if (embed.info) {
            e = new MessageEmbed()
                .setDescription(msg)
                .setThumbnail(embed.info.thumbnail)
                // .setThumbnail(`attachment://${thumbnailAttachment.id}`)
                .setImage(embed.info.img.replace('{width}', '1600').replace('{height}', '900'))
                // .setImage(`attachment://${imageAttachment.id}`)
                .setURL(embed.info.url)
                .setColor('DARK_VIVID_PINK');
        }
        else if (embed.embed) {
            e = embed.embed;
        }
        else {
            return;
        }

        (channel as TextChannel).send({ content: pingText, embeds: [e] });
        return;

    }

    static wrapInBackTicks(text: string): string {
        return `\`\`\`${text}\`\`\``;
    }

    static async getChannelByID(client: Client, channelID: string): Promise<Channel | null> {
        return await client.channels.fetch(channelID);
    }
}