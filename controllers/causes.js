const db = require('../config/database');
const Causes = db.Cause;
const Op = db.Sequelize.Op;

module.exports = {
    create,
    update,
    getOne,
    getUser,
    getAll,
    remove
};

async function create(req, res) {
    try {
        const cause = await Causes.create({
            creator: req.body.creator,
            funds: 0,
            status: 'CREATED'
        })
        const causeId = cause.dataValues.id;

        return res.status(201).json( causeId );
    } catch (err) {
        return res.status(400).json(err);
    }
}

async function update(req, res) {
    try {
        const cause = await Causes.findOne({ where: { id: req.params.id } });

        await cause.update({
            name: req.body.name,
            about: req.body.about,
            goal: req.body.goal,
            funds: req.body.funds,
            start: req.body.start,
            time: req.body.time,
            icon: req.body.icon,
            status: req.body.status
        });

        return res.status(200).json({});
    } catch (err) {
        return res.status(400).json(err);
    }
}

async function getOne(req, res) {
    try {
        const cause = await Causes.findOne({ where: { id: req.params.id } });
        return res.status(200).json( cause );
    
    } catch (err) {
        return res.status(400).json(err);
    };
};

async function getUser(req, res) {
    try {
        const causes = await Causes.findAll({ where: { creator: req.params.id } });
        return res.status(200).json( causes );
    
    } catch (err) {
        return res.status(400).json(err);
    };
};

async function getAll(req, res){
    try {
        const causes = await Causes.findAll({  where: { status: 'ACTIVE' }, order: [['funds', 'DESC'], ['goal', 'ASC']], limit: 4 });
        res.status(200).json( causes )
        
    } catch(err){
        return res.status(401).json(err)
    }
}

async function remove(req, res) {
    try {
        await Causes.destroy({ where: { id: req.params.id } });
        return res.status(200).json({});

    } catch (err) {
        return res.status(400).json(err);
    };
};