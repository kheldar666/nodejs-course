const { buildSchema } = require("graphql");

/* bellow, need to use ` , not ' */
module.exports = buildSchema(`
    """Mutation and Data Models"""
    type Post {
        _id:ID!
        title:String!
        content:String!
        imageUrl:String!
        creator:User!
        createdAt:String!
        updatedAt:String!
    }
    type User {
        _id:ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]
    }
    input UserInputData {
        email:String!
        name: String!
        password: String!
    }
    
    input PostInputData {
        title:String!
        content:String!
        imageUrl:String!
    }
     
    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
    }
    
    """Queries"""
    
    type AuthData {
        userId:String!
        token:String!
    }
    
    type PostsData {
        posts:[Post!]!
        totalItems:Int!
    }
    
    type RootQuery {
        login(email:String!, password:String!): AuthData
        getPosts(page: Int!): PostsData
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);
