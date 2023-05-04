const db = require('../config/database');
const Bids = db.Bid;
const Op = db.Sequelize.Op;

module.exports = {
    create,
    update,
    getOne,
    getAll,
    getUser,
    remove
};

async function create(req, res) {
    try {
        const bid = await Bids.create({
            creator: req.body.creator,
            auction: req.body.auction,
            amount: req.body.amount,
            cause: req.body.cause,
            status: 'LEADER'
        })
        const bidId = bid.dataValues.id;

        return res.status(201).json( bidId );
    } catch (err) {
        return res.status(400).json(err);
    }
}

async function update(req, res) {
    try {
        const bid = await Bids.findOne({ where: { id: req.params.id } });

        await bid.update({
            amount: req.body.amount,
            status: req.body.status
        });

        return res.status(200).json({});
    } catch (err) {
        return res.status(400).json(err);
    }
}

async function getOne(req, res) {
    try {
        const bid = await Bids.findOne({ where: { id: req.params.id } });
        return res.status(200).json( bid );
    
    } catch (err) {
        return res.status(400).json(err);
    };
};

async function getAll(req, res){
    try {
        const bids = await Bids.findAll({ order: [['amount', 'DESC'], ['creator', 'ASC']], limit: 10 });
        res.status(200).json( bids )
        
    } catch(err){
        return res.status(401).json(err)
    }
}

async function getUser(req, res) {
    try {
        const bids = await Bids.findAll({ where: { creator: req.params.id } });
        return res.status(200).json( bids );

    } catch (err) {
        return res.status(400).json(err);
    };
};

async function remove(req, res) {
    try {
        await Bids.destroy({ where: { id: req.params.id } });
        return res.status(200).json({});

    } catch (err) {
        return res.status(400).json(err);
    };
};