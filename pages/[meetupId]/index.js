import { MongoClient, ObjectId } from 'mongodb'
import Head from 'next/head'

import MeetupDetail from "../../components/meetups/MeetupDetail"

const MEETUP_DB = 'mongodb+srv://user-of-nhuando:x9rk1QcQVJpQa6Rm@cluster0.vu4rk.mongodb.net/meetup?retryWrites=true&w=majority'

function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta 
          name='description'
          content={props.meetupData.description}
        />
      </Head>
      <MeetupDetail {...props.meetupData} />
    </>
  )
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(MEETUP_DB)
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

  client.close()

  return {
    fallback: false,
    paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
  }
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId
  // console.log(meetupId)

  const client = await MongoClient.connect(MEETUP_DB)
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) })

  client.close()

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      }
    }
  }
}

export default MeetupDetails
