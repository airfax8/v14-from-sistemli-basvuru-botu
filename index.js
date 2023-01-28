const { Client, ButtonBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./setting/config.js");
const db = require('croxydb');

const client = new Client({
  partials: [
    Partials.Message, // for message
    Partials.Channel, // for text channel
    Partials.GuildMember, // for guild member
    Partials.Reaction, // for message reaction
    Partials.GuildScheduledEvent, // for guild events
    Partials.User, // for discord user
    Partials.ThreadMember, // for thread member
  ],
  intents: [
    GatewayIntentBits.Guilds, // for guild related things
    GatewayIntentBits.GuildMembers, // for guild members related things
    GatewayIntentBits.GuildBans, // for manage guild bans
    GatewayIntentBits.GuildEmojisAndStickers, // for manage emojis and stickers
    GatewayIntentBits.GuildIntegrations, // for discord Integrations
    GatewayIntentBits.GuildWebhooks, // for discord webhooks
    GatewayIntentBits.GuildInvites, // for guild invite managing
    GatewayIntentBits.GuildVoiceStates, // for voice related things
    GatewayIntentBits.GuildPresences, // for user presence things
    GatewayIntentBits.GuildMessages, // for guild messages things
    GatewayIntentBits.GuildMessageReactions, // for message reactions things
    GatewayIntentBits.GuildMessageTyping, // for message typing things
    GatewayIntentBits.DirectMessages, // for dm messages
    GatewayIntentBits.DirectMessageReactions, // for dm message reaction
    GatewayIntentBits.DirectMessageTyping, // for dm message typinh
    GatewayIntentBits.MessageContent, // enable if you need message content things
  ],
});

module.exports = client;

require("./events/message.js")
require("./events/ready.js")

client.login(config.token || process.env.TOKEN).catch(e => {
console.log("The Bot Token You Entered Into Your Project Is Incorrect Or Your Bot's INTENTS Are OFF!")
})







///////////////////////////KOMUTLAR

const soru = require("./setting/sorular.js");

client.on("interactionCreate", async (i) => {

  const modal = new ModalBuilder()
  .setCustomId('ybasvuru')
  .setTitle('Yetkili Başvuru')
  .setComponents(
    new ActionRowBuilder()
      .setComponents(
        new TextInputBuilder()
        .setCustomId("soru1")
        .setLabel(`${soru.soru1}`)
        .setStyle(1)
        .setMinLength(5)
        .setMaxLength(20)
        .setPlaceholder(`${soru.cevap1}`)
        .setRequired(true),
      ),
    new ActionRowBuilder()
      .setComponents(
        new TextInputBuilder()
        .setCustomId("soru2")
        .setLabel(`${soru.soru2}`)
        .setStyle(1)
        .setMinLength(1)
        .setMaxLength(10)
        .setPlaceholder(`${soru.cevap2}`)
        .setRequired(true)
      ),
    new ActionRowBuilder()
      .setComponents(
        new TextInputBuilder()
        .setCustomId("soru3")
        .setLabel(`${soru.soru3}`)
        .setStyle(1)
        .setMinLength(5)
        .setMaxLength(100)
        .setPlaceholder(`${soru.cevap3}`)
        .setRequired(true)
      ),
      new ActionRowBuilder()
      .setComponents(
          new TextInputBuilder()
          .setCustomId("soru4")
          .setLabel(`${soru.soru4}`)
          .setStyle(1)
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder(`${soru.cevap4}`)
          .setRequired(true)
      ),
    new ActionRowBuilder()
      .setComponents(
          new TextInputBuilder()
          .setCustomId("soru5")
          .setLabel(`${soru.soru5}`)
          .setStyle(1)
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder(`${soru.cevap5}`)
          .setRequired(true)
      )
  )
  if (i.customId === "basvuru_buton") {
      i.showModal(modal)
  }
  let message ;
  let logKanalı = client.channels.cache.get(config.logKanalı)

  if (i.customId === "ybasvuru") {

      const kabulet = new ButtonBuilder()
      .setCustomId("basvuru_kabul")
      .setLabel("Kabul Et")
      .setStyle(3)
      .setEmoji("✅")

      const reddet = new ButtonBuilder()
      .setCustomId("basvuru_red")
      .setLabel("Reddet")
      .setStyle(1)
      .setEmoji("❌")

      const row4 = new ActionRowBuilder()
      .addComponents(kabulet,reddet)

      
      const soru1 = i.fields.getTextInputValue("soru1");
      const soru2 = i.fields.getTextInputValue("soru2");
      const soru3 = i.fields.getTextInputValue("soru3");
      const soru4 = i.fields.getTextInputValue("soru4");
      const soru5 = i.fields.getTextInputValue("soru5");

      const titan = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: `${i.guild.name} Başvuru Sistemi`})
      .setThumbnail(i.guild.iconURL())
      .setDescription(`
      **${i.user.tag}** - (\`${i.user.id}\`) ** Kullanıcısının Başvuru Formu**
      
      **${soru.soru1}**
      \`${soru1}\`
      **${soru.soru2}**
      \`${soru2}\`
      **${soru.soru3}**
      \`${soru3}\`
      **${soru.soru4}**
      \`${soru4}\`
      **${soru.soru5}**
      \`${soru5}\`
      `)
      .setTimestamp()

      await i.reply({ content: `Başvurunuz başarıyla alındı, şimdi tek yapmanız gereken yetkililerin cevap vermesini beklemek :) umarım kabul edilir..`, ephemeral: true})
      message = await logKanalı.send({ content: `${i.user}`, embeds: [titan], components: [row4]})
      db.set(message.id,i.user.id)
  }

  const basvuruDurum = client.channels.cache.get(config.basvuruDurum)

  if (i.customId === "basvuru_kabul") {

      if (!i.member.roles.cache.has(config.basvuruYt)) return i.reply({ content: `Başvuruyu yanıtlamak için <@&${config.basvuruYt}> rolüne sahip olmalısın`, ephemeral: true})

      const kabulet2 = new ButtonBuilder()
      .setCustomId("basvuru_kabul")
      .setLabel("Kabul Edildi")
      .setStyle(3)
      .setEmoji("✅")
      .setDisabled(true)


      const row5 = new ActionRowBuilder()
      .addComponents(kabulet2)

      i.update({ components: [row5]})
      let kişi = db.get(i.message.id)
      let kullanıcı = i.client.guilds.cache.get(config.guildID).members.cache.get(kişi) 
      kullanıcı.roles.add(config.yetkiRolleri)
      await basvuruDurum.send({ content: `<@${kişi}>, Tebrikler! Başvurunuz **kabul edildi** ve **yetkili ekibimize** onaylandınız. \n **Sizi onaylayan kişi: **${i.user.toString()}`})
      kullanıcı.user.send(`Yetkili Başvurun Başarıyla **Onaylanmıştır**`).catch(() => {});
      db.delete(i.message.id)
  } 
  if (i.customId === "basvuru_red") {

      let kişi = db.get(i.message.id)
      let kullanıcı = i.client.guilds.cache.get(config.guildID).members.cache.get(kişi)

      const reddet2 = new ButtonBuilder()
      .setCustomId("başvuru_red")
      .setLabel("Reddedildi")
      .setStyle(1)
      .setEmoji("❌")
      .setDisabled(true)

      const row6 = new ActionRowBuilder()
      .addComponents(reddet2)
      await basvuruDurum.send({ content: `<@${kişi}>, Maalesef ! Başvurunuz **kabul edilmedi** ve **yetkili ekibimize** onaylanmadınız. \n **Sizi onaylamayan kişi: **${i.user.toString()}`})
      i.update({ components: [row6]})
      kullanıcı.user.send(`Maalef yetkili başvurun reddedilmiştir!`).catch(() => {});
      db.delete(i.message.id)
  }
})