// import { useRouter } from "next/router";
// import { Fragment } from "react";
import Head from 'next/head'
import { MongoClient, ObjectId } from 'mongodb'
import { Fragment } from 'react';
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetailsPage(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>``
      <MeetupDetail
        id={props.meetupData.id}
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://sksssd234:RnmCuUixmD1e8zQA@cluster0.uvsyzlj.mongodb.net/meetups"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({},{_id:1}).toArray()

  const paths = meetups.map(meetup=>{
    return {
      params: {
        meetupId: meetup._id.toString()
      }
    }
  })

  client.close();

  return {
    fallback: false,
    paths: paths,
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://sksssd234:RnmCuUixmD1e8zQA@cluster0.uvsyzlj.mongodb.net/meetups"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)})
  const meetupData = {
    id: meetup._id.toString(),
    title: meetup.title,
    image: meetup.image,
    address: meetup.address,
    description: meetup.description
  }
  client.close();
  return {
    props: {
      meetupData
    },
  };
}

export default MeetupDetailsPage;
