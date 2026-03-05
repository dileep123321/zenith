const { MongoClient } = require('mongodb');

async function testConnection() {
    const url = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Successfully connected to MongoDB from host!');
        const admin = client.db('admin');
        const databases = await admin.command({ listDatabases: 1 });
        console.log('Databases:', databases.databases.map(db => db.name));
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
    } finally {
        await client.close();
    }
}

testConnection();
