const axios = require("axios")

const db = require("../models")
const NftItem = db.table.NftItem
const Owner = db.table.Owner

async function getAllItems() {
  console.log('---------')
  let cursor = ""
  do {
    try {
      const { data } = await axios(`https://deep-index.moralis.io/api/v2/nft/${process.env.PIZZA_NFT_CONTRACT_ADDRESS}?chain=bsc&format=decimal&cursor=${cursor}`, {
      headers: {
        'x-api-key': process.env.MORALIS_KEY
      }
    })

    for (const item of data.result) {
      await NftItem.findOneAndUpdate({tokenId: item.token_id}, {
        tokenId: item.token_id,
      },{
        new: true,
        upsert: true
      })
    }
    cursor = data.cursor
    } catch (err) {
      // console.log(err)
    }
  } while (cursor != '' && cursor != null)
}


async function getAllOwners() {
  console.log('==============')
  let cursor = ""
  do {
    try {
      const { data } = await axios(`https://deep-index.moralis.io/api/v2/nft/${process.env.PIZZA_NFT_CONTRACT_ADDRESS}/owners?chain=bsc&format=decimal&cursor=${cursor}`, {
      headers: {
        'x-api-key': process.env.MORALIS_KEY
      }
    })

    for (const owner of data.result) {
      await Owner.findOneAndUpdate({tokenId: owner.token_id, tokenAddress: owner.token_address, ownerOf: owner.owner_of}, {
        tokenAddress:owner.token_address,
        tokenId: owner.token_id,
        ownerOf: owner.owner_of
      },{
        new: true,
        upsert: true
      })
    }
    cursor = data.cursor
    } catch (err) {
      // console.log(err)
    }
  } while (cursor != '' && cursor != null)
}

const callRequestToMoralis = () => {
  setInterval(() => {
    getAllItems()
    getAllOwners()
  }, 10000)
}

module.exports = {
  callRequestToMoralis,
}
