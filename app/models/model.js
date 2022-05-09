module.exports = mongoose => {

  var nftItem = mongoose.Schema(
    {
      tokenId: Number
    },
  )
  nftItem.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const NftItem = mongoose.model("nftItem", nftItem)

  var owner = mongoose.Schema(
    {
      tokenAddress: String,
      tokenId: Number,
      ownerOf: String
    },
  )
  owner.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Owner = mongoose.model("owner", owner)

  return { NftItem, Owner };
};
