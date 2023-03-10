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
  .setTitle('Yetkili Ba??vuru')
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
  let logKanal?? = client.channels.cache.get(config.logKanal??)

  if (i.customId === "ybasvuru") {

      const kabulet = new ButtonBuilder()
      .setCustomId("basvuru_kabul")
      .setLabel("Kabul Et")
      .setStyle(3)
      .setEmoji("???")

      const reddet = new ButtonBuilder()
      .setCustomId("basvuru_red")
      .setLabel("Reddet")
      .setStyle(1)
      .setEmoji("???")

      const row4 = new ActionRowBuilder()
      .addComponents(kabulet,reddet)

      
      const soru1 = i.fields.getTextInputValue("soru1");
      const soru2 = i.fields.getTextInputValue("soru2");
      const soru3 = i.fields.getTextInputValue("soru3");
      const soru4 = i.fields.getTextInputValue("soru4");
      const soru5 = i.fields.getTextInputValue("soru5");

      const titan = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: `${i.guild.name} Ba??vuru Sistemi`})
      .setThumbnail(i.guild.iconURL())
      .setDescription(`
      **${i.user.tag}** - (\`${i.user.id}\`) ** Kullan??c??s??n??n Ba??vuru Formu**
      
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

      await i.reply({ content: `Ba??vurunuz ba??ar??yla al??nd??, ??imdi tek yapman??z gereken yetkililerin cevap vermesini beklemek :) umar??m kabul edilir..`, ephemeral: true})
      message = await logKanal??.send({ content: `${i.user}`, embeds: [titan], components: [row4]})
      db.set(message.id,i.user.id)
  }

  const basvuruDurum = client.channels.cache.get(config.basvuruDurum)

  if (i.customId === "basvuru_kabul") {

      if (!i.member.roles.cache.has(config.basvuruYt)) return i.reply({ content: `Ba??vuruyu yan??tlamak i??in <@&${config.basvuruYt}> rol??ne sahip olmal??s??n`, ephemeral: true})

      const kabulet2 = new ButtonBuilder()
      .setCustomId("basvuru_kabul")
      .setLabel("Kabul Edildi")
      .setStyle(3)
      .setEmoji("???")
      .setDisabled(true)


      const row5 = new ActionRowBuilder()
      .addComponents(kabulet2)

      i.update({ components: [row5]})
      let ki??i = db.get(i.message.id)
      let kullan??c?? = i.client.guilds.cache.get(config.guildID).members.cache.get(ki??i) 
      kullan??c??.roles.add(config.yetkiRolleri)
      await basvuruDurum.send({ content: `<@${ki??i}>, Tebrikler! Ba??vurunuz **kabul edildi** ve **yetkili ekibimize** onayland??n??z. \n **Sizi onaylayan ki??i: **${i.user.toString()}`})
      kullan??c??.user.send(`Yetkili Ba??vurun Ba??ar??yla **Onaylanm????t??r**`).catch(() => {});
      db.delete(i.message.id)
  } 
  if (i.customId === "basvuru_red") {

      let ki??i = db.get(i.message.id)
      let kullan??c?? = i.client.guilds.cache.get(config.guildID).members.cache.get(ki??i)

      const reddet2 = new ButtonBuilder()
      .setCustomId("ba??vuru_red")
      .setLabel("Reddedildi")
      .setStyle(1)
      .setEmoji("???")
      .setDisabled(true)

      const row6 = new ActionRowBuilder()
      .addComponents(reddet2)
      await basvuruDurum.send({ content: `<@${ki??i}>, Maalesef ! Ba??vurunuz **kabul edilmedi** ve **yetkili ekibimize** onaylanmad??n??z. \n **Sizi onaylamayan ki??i: **${i.user.toString()}`})
      i.update({ components: [row6]})
      kullan??c??.user.send(`Maalef yetkili ba??vurun reddedilmi??tir!`).catch(() => {});
      db.delete(i.message.id)
  }
})