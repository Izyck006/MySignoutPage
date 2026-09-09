import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

try {
  admin.initializeApp({
    projectId: "mysignout-ee7e8"
  });
} catch (e) {}

async function run() {
  const db = getFirestore();
  
  const messagesSnapshot = await db.collection("messages").get();
  console.log(`Found ${messagesSnapshot.docs.length} messages.`);
  
  if (messagesSnapshot.empty) {
    console.log("No messages found.");
    return;
  }
  
  const msg = messagesSnapshot.docs[0].data();
  if (msg.imageData) {
    const base64Data = msg.imageData.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync("test_image_from_db.png", base64Data, 'base64');
    console.log("Saved to test_image_from_db.png");
  } else {
    console.log("No imageData found on message");
  }
}

run();
