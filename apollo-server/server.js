const { ApolloServer, gql } = require('apollo-server');
const { listUsers } = require('../grpc-client/grpc-client');

// GraphQLスキーマ定義
const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
    age: Int
  }

  type Query {
    listUsers(order: Int, limit: Int, orderType: Int): [User]
  }
`;

// リゾルバーの定義
const resolvers = {
    Query: {
        listUsers: async (_, { order, limit, orderType }) => {
            try {
                return await listUsers(order, limit, orderType);
            } catch (error) {
                throw new Error(`Failed to fetch users: ${error.message}`);
            }
        },
    },
};

// Apollo Serverのインスタンス化
const server = new ApolloServer({ typeDefs, resolvers });

// サーバーの起動
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});