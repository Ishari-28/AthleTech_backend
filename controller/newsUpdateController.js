const newsUpdateService = require("../services/newsUpdateService");

// GET all news updates
const getNewsUpdates = async (req, res) => {
    try {
        const data = await newsUpdateService.getAllNewsUpdates();
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No records found'
            });
        }
        res.status(200).send({
            success: true,
            message: 'All news updates retrieved',
            data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error retrieving news updates',
            error: error.message
        });
    }
};

// GET news update by ID
const getNewsUpdateByID = async (req, res) => {
    try {
        const newsId = req.params.id;
        if (!newsId) {
            return res.status(400).send({
                success: false,
                message: 'Invalid ID'
            });
        }
        const data = await newsUpdateService.getNewsUpdateById(newsId);
        if (!data) {
            return res.status(404).send({
                success: false,
                message: 'No records found'
            });
        }
        res.status(200).send({
            success: true,
            newsUpdateDetails: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error retrieving news update',
            error: error.message
        });
    }
};

// CREATE news update
const createNewsUpdate = async (req, res) => {
    try {
        const { date, news_topic, news_description } = req.body;
        const image = req.file ? req.file.buffer : null;
        if (!date || !news_topic || !news_description || !image) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all fields'
            });
        }
        await newsUpdateService.createNewsUpdate({ date, news_topic, news_description, image });
        res.status(201).send({
            success: true,
            message: 'New news update created',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error creating news update',
            error: error.message
        });
    }
};

// UPDATE news update
const updateNewsUpdate = async (req, res) => {
    try {
        const newsId = req.params.id;
        const { date, news_topic, news_description } = req.body;
        const image = req.file ? req.file.buffer : null;
        if (!newsId) {
            return res.status(400).send({
                success: false,
                message: 'Invalid ID'
            });
        }
        await newsUpdateService.updateNewsUpdate(newsId, { date, news_topic, news_description, image });
        res.status(200).send({
            success: true,
            message: 'News update updated successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error updating news update',
            error: error.message
        });
    }
};

// DELETE news update
const deleteNewsUpdate = async (req, res) => {
    try {
        const newsId = req.params.id;
        if (!newsId) {
            return res.status(400).send({
                success: false,
                message: 'Please provide news update ID'
            });
        }
        await newsUpdateService.deleteNewsUpdate(newsId);
        res.status(200).send({
            success: true,
            message: 'News update deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error deleting news update',
            error: error.message
        });
    }
};

module.exports = {
    getNewsUpdates,
    getNewsUpdateByID,
    createNewsUpdate,
    updateNewsUpdate,
    deleteNewsUpdate,
};