const ALL_EMOJIS = require("./emojis")

const fs = require("fs")
const path = require("path")
require.extensions[".txt"] = function (module, filename) {
  module.exports = fs.readFileSync(filename, "utf8")
}

const randomElement = (array) => array[Math.floor(Math.random() * array.length)]

const patterns = require("./patterns/all.txt")

const { TwitterApi } = require("twitter-api-v2")

const userClient = new TwitterApi(require("../config"))

const rolls = [`⬜️`, `🟩`, `🟥`, `🟦`, `🟫`, `🟧`, `🟨`, `🟪`, `⬛️`, `🔠`]

const roll = () => {
  const pattern = randomElement(patterns.split(/\r\n\r\n/))

  const emojis = rolls.map((roll) => randomElement(ALL_EMOJIS))

  const msg = rolls.reduce(
    (body, el) => body.replaceAll(el, emojis[rolls.indexOf(el)].emoji),
    pattern
  )

  console.log(msg)

  return userClient.v2.tweet(msg).then(console.log)
}

const reroll = async () => {
  try {
    return await roll()
  } catch (e) {
    console.log(e)
    clearInterval(id)
    id = setInterval(reroll, 60000)
  }
}

let id = setInterval(reroll, 60000)
