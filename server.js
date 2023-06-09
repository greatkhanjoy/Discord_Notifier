require('dotenv').config()
const { Client, IntentsBitField } = require('discord.js')
const nodemailer = require('nodemailer')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('messageCreate', (message) => {
  if (message.content.toLowerCase() == 'notify') {
    message.reply(
      `hey! I am Notifier. I will notify SenkuBhai when someone starts playing a game!`
    )
  }
})

client.on('presenceUpdate', (oldPresence, newPresence) => {
  // Check if the user is playing a game
  // console.log(newPresence?.activities[0]?.name)
  if (newPresence?.activities[0]?.name) {
    console.log(
      `${newPresence.user.username} is playing ${newPresence.activities[0]?.name}`
    )
    // Send an email with the user's name and the game they are playing
    sendEmail(newPresence.user.username, newPresence?.activities[0]?.name)
  }
})

function sendEmail(username, game) {
  // Create a transporter object with your email credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASSWORD,
    },
  })

  var maillist = [process.env.MAIL_SENDER, 'Rajonraj0300@gmail.com']

  // Define the email message
  const message = {
    from: process.env.MAIL_SENDER,
    to: maillist,
    subject: `${username} is playing ${game}`,
    text: `${username} is playing ${game}`,
  }

  // Send the email
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error(error)
    } else {
      console.log(`Email sent: ${info.response}`)
    }
  })
}

client.login(process.env.DISCORD_TOKEN)
