const db = require('../config/database');
const Auctions = db.Auction;
const Op = db.Sequelize.Op;


module.exports = {
  create,
  update,
  getOne,
  getAll,
  getCause,
  remove
};

async function create(req, res) {
  try {
    const auction = await Auctions.create({
      creator: req.body.creator,
      funds: 0,
      status: 'CREATED'
    })
    const auctionId = auction.dataValues.id;

    return res.status(201).json( auctionId );
  } catch (err) {
      return res.status(400).json(err);
  }
}

async function update(req, res) {
  try {
    const auction = await Auctions.findOne({ where: { id: req.params.id } });

    await auction.update({
      name: req.body.name,
      width: req.body.width,
      height: req.body.height,
      depth: req.body.depth,
      start: req.body.start,
      time: req.body.time,
      funds: req.body.funds,
      image1: req.body.image1,
      image2: req.body.image2,
      image3: req.body.image3,
      cause: req.body.cause,
      status: req.body.status
    });

    return res.status(200).json({});
  } catch (err) {
      return res.status(400).json(err);
  }
}

async function getOne(req, res) {
  try {
    const auction = await Auctions.findOne({ where: { id: req.params.id } });
    return res.status(200).json( auction );

  } catch (err) {
    return res.status(400).json(err);
  };
};

async function getAll(req, res) {
  try {
    const data = await Auctions.findAll({ });
    let auctions = [];
    data.forEach(function(auction){
      if (auction.start > 0){
        auctions.push(auction);
      };
    })
    res.status(200).json( auctions )

  } catch (err) {
    return res.status(400).json(err);
  };
};

async function getCause(req, res) {
  try {
      const auctions = await Auctions.findAll({ where: { cause: req.params.id } });
      return res.status(200).json( auctions );

  } catch (err) {
      return res.status(400).json(err);
  };
};

async function remove(req, res) {
  try {
    await Auctions.destroy({ where: { id: req.params.id } });
    return res.status(200).json({});

  } catch (err) {
    return res.status(400).json(err);
  };
};