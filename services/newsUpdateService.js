const db = require("../config/db");

const getAllNewsUpdates = async () => {
    const [data] = await db.query('SELECT * FROM news_update');
    return data;
};

const getNewsUpdateById = async (newsId) => {
    const [data] = await db.query('SELECT * FROM news_update WHERE news_id = ?', [newsId]);
    return data[0];
};

const createNewsUpdate = async ({ date, news_topic, news_description, image }) => {
    return db.query(
        'INSERT INTO news_update (date, news_topic, news_description, image) VALUES (?, ?, ?, ?)',
        [date, news_topic, news_description, image]
    );
};

const updateNewsUpdate = async (newsId, { date, news_topic, news_description, image }) => {
    if (image) {
        return db.query(
            'UPDATE news_update SET date = ?, news_topic = ?, news_description = ?, image = ? WHERE news_id = ?',
            [date, news_topic, news_description, image, newsId]
        );
    } else {
        return db.query(
            'UPDATE news_update SET date = ?, news_topic = ?, news_description = ? WHERE news_id = ?',
            [date, news_topic, news_description, newsId]
        );
    }
};

const deleteNewsUpdate = async (newsId) => {
    return db.query('DELETE FROM news_update WHERE news_id = ?', [newsId]);
};

module.exports = {
    getAllNewsUpdates,
    getNewsUpdateById,
    createNewsUpdate,
    updateNewsUpdate,
    deleteNewsUpdate,
};