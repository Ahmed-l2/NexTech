import { Client, Account, ID, Avatars, Databases } from 'react-native-appwrite';
// Init your React Native SDK

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.codevs.aora',
    projectId: '66db49460035dfeb1cc6',
    databaseId: '66db4a7d0000655f5723',
    userCollectionId: '66db4aa4001d48dfed38',
    videoCollectionId: '66db4aca003205c1df3e',
    storageId: '66db4bde0019a97e7d26',
}

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return session
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
