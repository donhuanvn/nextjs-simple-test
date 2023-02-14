
import { MongoClient } from 'mongodb' // next.js detected it as server-side dependancies (not included in client-side bundle)
import Head from 'next/head'

import MeetupList from '../components/meetups/MeetupList'

const MEETUP_DB = 'mongodb+srv://user-of-nhuando:x9rk1QcQVJpQa6Rm@cluster0.vu4rk.mongodb.net/meetup?retryWrites=true&w=majority'
/*
const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'A first meetup',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/800px-Stadtbild_M%C3%BCnchen.jpg?20130611211153',
    address: 'Some address 5, 12345 Some City',
    description: 'This is a first meetup!'
  },
  {
    id: 'm2',
    title: 'A second meetup',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/800px-Stadtbild_M%C3%BCnchen.jpg?20130611211153',
    address: 'Some address 5, 12345 Some City',
    description: 'This is a second meetup!'
  }
]
*/
function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}


export async function getStaticProps() {
  // fetch data from an API 
  // must return an object

  const client = await MongoClient.connect(MEETUP_DB)
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find().toArray()

  client.close()

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        description: meetup.description,
        id: meetup._id.toString()
      }))
    },
    revalidate: 10 // regenerated on server (after deployment) every 10 seconds
  }
}


/*
export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;

  // fetch data from an API
  // run on server (not client)
  // run on every request (no need revalidate)

  return {
    props: {
      meetups: DUMMY_MEETUPS
    },
  }
}
*/

export default HomePage
