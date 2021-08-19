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
     
    type RootMutation {
        createUser(userInput: UserInputData): User!
    }
    
    """Queries"""
    
    type RootQuery {
        hello:String
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);
