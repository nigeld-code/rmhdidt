const Tile = require('../../models/tile');

module.exports = {
  tiles: () => {
    return Tile.find().sort('order')
      .then(tiles => {
        return tiles;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  tile: args => {
    return Tile.findOne({ _id: args.id })
      .then(tile => {
        if (!tile) {
          throw new Error('No Tile Found');
        }
        return tile;
      })
      .catch(err => {
        throw err;
      });
  }
};
