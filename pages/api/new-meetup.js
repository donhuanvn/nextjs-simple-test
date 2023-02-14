// /api/new-meetup
// POST /api/new-meetup

import { MongoClient } from 'mongodb'

const MEETUP_DB = 'mongodb+srv://user-of-nhuando:x9rk1QcQVJpQa6Rm@cluster0.vu4rk.mongodb.net/meetup?retryWrites=true&w=majority'

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body

    // const { title, image, address, description } = data

    const client = await MongoClient.connect(MEETUP_DB)
    const db = client.db()

    const meetupsCollection = db.collection('meetups')

    const result = await meetupsCollection.insertOne(data)

    console.log(result)

    client.close()

    res.status(201).json({ message: 'Meetup is inserted!' })
  }
}

export default handler
