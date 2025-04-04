'use strict'

const fetch = require('node-fetch')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get('/player/:riotId', async function (request, reply) {
    try {
      const riotId = request.params.riotId
      const [name, tag] = riotId.split('-')

      console.log(name, tag)
      
      // First API call to get PUUID (you'll provide the URL)
      const puuidResponse = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${process.env.RIOT_API_KEY}`)
      
      if (!puuidResponse.ok) {
        throw new Error('Failed to fetch PUUID')
      }
      
      const puuidData = await puuidResponse.json()
      const puuid = puuidData.puuid // Adjust based on actual response structure
      
      // Second API call to get match info using PUUID
      const matchResponse = await fetch(`https://la1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${process.env.RIOT_API_KEY}`)
      
      if (!matchResponse.ok) {
        throw new Error('Failed to fetch match data')
      }
      
      const matchData = await matchResponse.json()
      const runesInfoResponse = await fetch(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/es_mx/v1/perks.json`)
      const runesInfo = await runesInfoResponse.json()

      const runes = matchData.participants.find(p => p.puuid === puuid).perks.perkIds;
      
     return runes.map(runeId => runesInfo.find(rune => rune.id === runeId).name).join(', ')
    } catch (error) {
      reply.code(500).send({ error: error.message })
    }
  })
}
