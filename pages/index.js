import Head from 'next/head'
import {MongoClient} from 'mongodb'

import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from 'react';

function HomePage(props) {
  return <Fragment>
    <Head>
      <title>React Meetups</title>
      <meta name="description" content="Browse a huge list of higly active React Meetups" />
    </Head>
    <MeetupList meetups={props.meetups} />
  </Fragment>
}

export async function getStaticProps(){
  const client = await MongoClient.connect(
    "mongodb+srv://sksssd234:RnmCuUixmD1e8zQA@cluster0.uvsyzlj.mongodb.net/meetups"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(meetup=>{
        return {
          title: meetup.title,
          address: meetup.address,
          image: meetup.image,
          id: meetup._id.toString()
        }
      }),
    },
    revalidate: 1,
  };
}

// export async function getServerSideProps(context){
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   }
// }

export default HomePage;
