const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// .protoファイルをロード
const PROTO_PATH = path.join(__dirname, '../proto/users.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});

// gRPCパッケージをロード
const proto = grpc.loadPackageDefinition(packageDefinition).users;

// gRPCクライアントを作成
const client = new proto.UsersService('localhost:50051', grpc.credentials.createInsecure());

// ユーザーのリストを取得するためのgRPCクライアント関数
function listUsers(order, limit, orderType) {
    return new Promise((resolve, reject) => {
        const metadata = new grpc.Metadata();
        // 'authorization' ヘッダーを設定し、'Bearer 'プレフィックスを付ける
        let apiKey = 'test-token';
        metadata.add('authorization', `Bearer ${apiKey}`);
        client.ListUser({ order, limit, order_type: orderType },metadata, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response.userList);
            }
        });
    });
}

module.exports = { listUsers };