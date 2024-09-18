import { Alert } from 'react-native';
import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
// Init your React Native SDK

export const config = {
    endpoint: 'https://nextech.ahmed-codes.tech/v1',
    platform: 'com.codevs.aora',
    projectId: '66db8efc0039fdff1273',
    databaseId: '66db93920027e9ca51e5',
    userCollectionId: '66db93bb0030e779d5b8',
    videoCollectionId: '66db93cd0023680c2b53',
    commentCollectionId: '66e07df9001b22237b43',
    itemsCollectionId: '66e23dee0015bf5029b7',
    cartItemsColllectionId: '66e4ccd900171f5c237c',
    savedItemsCollectionId: '66e4cda6002839e71a9f',
    orderCollectionId: '66e76ddb000c6a99fba0',
    storageId: '66db9407002888560150',
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  commentCollectionId,
  storageId,
  itemsCollectionId,
  savedItemsCollectionId,
  cartItemsColllectionId,
  orderCollectionId,
} = config;

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)
const storage = new Storage(client)

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
      databaseId,
      userCollectionId,
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

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return session
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const GetCurrentUser = async () => {
  try {
    const currentAccount = await account.get()

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];

  } catch (error) {
    console.log(error)
  }
}

export const GetAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const GetLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const searchPosts = async (query) => {
  try {
    console.log(query)
    const posts = await databases.listDocuments(
      databaseId,
      itemsCollectionId,
      [Query.search('name', query)]
    )
    return posts.documents;
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const getLikedPosts = async (userId) => {
  try {
    const posts = await GetAllPosts();
    const likedPosts = []
    posts.forEach(post => {
      if (Array.isArray(post.likedBy) && post.likedBy.length > 0) {
        post.likedBy.forEach(like => {
          // console.log('post title: ', post.title, '\naccountId: ', like.accountId, '\nuserId: ', userId)
          if (like.$id === userId) {
            likedPosts.push(post)
          }
        });
      }
    });
    return likedPosts;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');

    return session;
  } catch (error) {
    throw new Error(error.message)
  }
}

export const uploadFile = async (file, type) => {
  if(!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
}

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl
  } catch (error) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const createVideoPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export const toggleLikeVideo = async (videoId, userId, likedBy) => {
  try {
    let likedByUsers = likedBy || [];
    let isLiked = likedByUsers.includes(userId);

    if (isLiked) {
      likedByUsers = likedByUsers.filter(id => id !== userId);
    } else {
      likedByUsers.push(userId);
    }

    await databases.updateDocument(
      databaseId,
      videoCollectionId,
      videoId,
      { likedBy: likedByUsers }
    );

    return {
      isLiked: !isLiked,
      likedByUsers
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const getVideoComments = async (videoId) => {
  try {
    const comments = await databases.listDocuments(
      databaseId,
      commentCollectionId,
      [Query.equal('video', videoId)]
    );
    return comments.documents;
  } catch (error) {
    console.error('Error fetching comments: ', error);
    throw new Error(error);
  }
};

export const GetAllItems = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      itemsCollectionId,
      [Query.orderDesc('$createdAt')]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const GeItem = async (itemId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      itemsCollectionId,
      [Query.equal('$id', itemId),]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const GetCategory = async (cId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      itemsCollectionId,
      [Query.equal('categoryId', cId),]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const existingItems = await databases.listDocuments(
      databaseId,
      cartItemsColllectionId,
      [
        Query.equal('userId', userId),
        Query.equal('itemId', productId)
      ]
    );

    if (existingItems.total > 0) {
      const existingItem = existingItems.documents[0];
      const updatedQuantity = existingItem.quantity + quantity;

      const response = await databases.updateDocument(
        databaseId,
        cartItemsColllectionId,
        existingItem.$id,
        {
          quantity: updatedQuantity
        }
      );

      console.log('Item quantity updated successfully:', response);
    } else {
      const cartItem = {
        userId: userId,
        itemId: productId,
        quantity: quantity,
      };

      const response = await databases.createDocument(
        databaseId,
        cartItemsColllectionId,
        ID.unique(),
        cartItem
      );

      console.log('Product added to cart successfully:', response);
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const existingItems = await databases.listDocuments(
      databaseId,
      cartItemsColllectionId,
      [
        Query.equal('userId', userId),
        Query.equal('itemId', productId)
      ]
    );

    if (existingItems.total > 0) {
      const existingItem = existingItems.documents[0];

      if (existingItem.quantity > 1) {
        const updatedQuantity = existingItem.quantity - 1;

        const response = await databases.updateDocument(
          databaseId,
          cartItemsColllectionId,
          existingItem.$id,
          {
            quantity: updatedQuantity
          }
        );

        console.log('Item quantity decremented successfully:', response);
      } else {
        const response = await databases.deleteDocument(
          databaseId,
          cartItemsColllectionId,
          existingItem.$id
        );

        console.log('Item removed from cart successfully:', response);
      }
    } else {
      console.log('Item not found in cart.');
    }
  } catch (error) {
    console.error('Error removing product from cart:', error);
  }
};

export const getUserCart = async (userId) => {
  try {
    // Step 1: Query to get all cart items for the user
    const cartItems = await databases.listDocuments(
      databaseId,
      cartItemsColllectionId,
      [
        Query.equal('userId', userId)
      ]
    );

    // If no items in cart, return an empty array
    if (cartItems.total === 0) {
      return [];
    }

    const cart = cartItems.documents;

    // Step 2: Fetch product details for each item in the cart (parallel)
    const items = await Promise.all(
      cart.map(async (item) => {
        const itemData = await databases.getDocument(
          databaseId,
          itemsCollectionId,
          item.itemId
        );
        // Append quantity to itemData and return
        return {
          ...itemData,
          quantity: item.quantity,
        };
      })
    );

    return items;

  } catch (error) {
    console.error('Error retrieving cart items:', error);
    throw new Error(error.message);
  }
};

export const createOrder = async (orderDetails) => {
  try {
    const response = await databases.createDocument(
      databaseId,
      orderCollectionId,
      ID.unique(),
      orderDetails
    );
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const clearCart = async (userId) => {
  try {
    // Step 1: Query to get all cart items for the user
    const cartItems = await databases.listDocuments(
      databaseId,
      cartItemsColllectionId,
      [
        Query.equal('userId', userId)
      ]
    );

    // If no items in cart, return early
    if (cartItems.total === 0) {
      console.log('No items to clear in the cart.');
      return;
    }

    // Step 2: Delete each cart item
    await Promise.all(
      cartItems.documents.map(async (item) => {
        await databases.deleteDocument(
          databaseId,
          cartItemsColllectionId,
          item.$id
        );
      })
    );

    console.log('Cart cleared successfully.');
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error(error.message);
  }
};

export const toggleSavedItem = async (userId, itemId) => {
  try {
    // Step 1: Check if the item is already saved by the user
    const savedItems = await databases.listDocuments(
      databaseId,
      savedItemsCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('itemId', itemId)
      ]
    );

    // Step 2: If item is already saved, remove it
    if (savedItems.total > 0) {
      const savedItem = savedItems.documents[0];
      await databases.deleteDocument(
        databaseId,
        savedItemsCollectionId,
        savedItem.$id
      );
      console.log('Item removed from saved items successfully.');
      return { success: true, action: 'removed' };
    }

    // Step 3: If item is not saved, add it to saved items
    else {
      const savedItem = {
        userId,
        itemId,
      };

      const response = await databases.createDocument(
        databaseId,
        savedItemsCollectionId,
        ID.unique(),
        savedItem
      );
      console.log('Item saved successfully:', response);
      return { success: true, action: 'saved' };
    }
  } catch (error) {
    console.error('Error toggling saved item:', error);
    throw new Error(error.message);
  }
};

export const getUserSavedItems = async (userId) => {
  try {
    const savedItems = await databases.listDocuments(
      databaseId,
      savedItemsCollectionId,
      [Query.equal('userId', userId)]
    );
    return savedItems.documents;
  } catch (error) {
    console.error('Error fetching saved items:', error);
    throw new Error(error.message);
  }
};

export const FetchSavedItems = async (userId) => {
  try {
    // Step 1: Get saved item IDs for the user
    const savedItems = await getUserSavedItems(userId);

    // Step 2: Extract item IDs from saved items
    const itemIds = savedItems.map(savedItem => savedItem.itemId);

    // If no saved items, return an empty array
    if (itemIds.length === 0) {
      return [];
    }

    // Step 3: Fetch each item document by ID (manually since Query.in is not available)
    const items = await Promise.all(itemIds.map(async (itemId) => {
      const item = await databases.getDocument(databaseId, itemsCollectionId, itemId);
      return item;
    }));

    return items;
  } catch (error) {
    console.error('Failed to fetch saved items with details:', error);
    return [];
  }
};

export const GetUserOrders = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      orderCollectionId,
      [Query.equal('userId', userId)]
    )
    return posts.documents;
  } catch (error) {
    console.log(error.message)
    throw new Error(error);
  }
}

export const getItemsByIds = async (itemsArray) => {
  console.log(itemsArray)
  try {
    // Step 1: Extract itemIds from the array
    const itemIds = itemsArray.map(item => item.itemId);

    // If no itemIds, return early
    if (itemIds.length === 0) {
      return [];
    }

    // Step 2: Fetch each item document by ID
    const items = await Promise.all(itemIds.map(async (itemId) => {
      const item = await databases.getDocument(databaseId, itemsCollectionId, itemId);
      return item;
    }));

    return items;
  } catch (error) {
    console.error('Error fetching items by IDs:', error);
    throw new Error(error.message);
  }
};
