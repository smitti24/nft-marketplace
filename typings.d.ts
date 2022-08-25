interface Image {
    asset: {
        url: string;
    }
}

export interface Creator {
    _id: string,
    name: string,
    address: string,
    slug: {
        current: string
    },
    iamge: Image,
    bio: string
}

export interface Collection {
    _id: string,
    _type: string,
    title: string,
    description: string,
    address: string,
    nftCollectionName: string,
    mainImage: Image,
    previewImage: Image,
    slug: {
        current: string
    },
    creator: Creator
}