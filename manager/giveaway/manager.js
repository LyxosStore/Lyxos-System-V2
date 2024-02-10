// Credits: https://www.npmjs.com/package/discord-giveaways

const { GiveawaysManager } = require('discord-giveaways');
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.
    async getAllGiveaways() {
        return new Promise((resolve, reject) => {
            sql.query('SELECT `data` FROM `giveaways`', (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                const giveaways = res.map((row) =>
                    JSON.parse(row.data, (_, v) =>
                        typeof v === 'string' && /BigInt\("(-?\d+)"\)/.test(v) ? eval(v) : v
                    )
                );
                resolve(giveaways);
            });
        });
    }

    // This function is called when a giveaway needs to be saved in the database.
    async saveGiveaway(messageId, giveawayData) {
        return new Promise((resolve, reject) => {
            sql.query(
                'INSERT INTO `giveaways` (`message_id`, `data`) VALUES (?,?)', [messageId, JSON.stringify(giveawayData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v))],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageId, giveawayData) {
        return new Promise((resolve, reject) => {
            sql.query(
                'UPDATE `giveaways` SET `data` = ? WHERE `message_id` = ?', [JSON.stringify(giveawayData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v)), messageId],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageId) {
        return new Promise((resolve, reject) => {
            sql.query('DELETE FROM `giveaways` WHERE `message_id` = ?', messageId, (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
    default: {
        botsCanWin: false,
        embedColor: `#ff0000`,
        embedColorEnd: `#400000`,
        reaction: '🎉'
    }
});

// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;