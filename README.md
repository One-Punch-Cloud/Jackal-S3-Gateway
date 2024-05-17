# Jackal S3-Compatible Node.js File Storage Server

This project provides an S3-compatible Node.js file storage server that interacts with the Jackal filesystem. The server supports operations like creating buckets, uploading files, downloading files, listing files, and deleting files, all secured with simple authentication.

## Features

- S3-compatible API endpoints
- Authentication using `ACCESS_KEY_ID` and `SECRET_ACCESS_KEY`
- File operations are performed directly on the Jackal filesystem

## Prerequisites

- Node.js and npm
- A Jackal mnemonic and network information

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/jackal-s3-server.git
   cd jackal-s3-server
   ```
2. Install the required packages:

   ```bash
   npm install
   ```
   
3. Create a .env file in the root directory with the following content:

   ```env
   SIGNER_CHAIN=lupulella-2
   MNEMONIC=your_jackal_mnemonic
   QUERY_ADDR=https://testnet-grpc.jackalprotocol.com
   TX_ADDR=https://testnet-rpc.jackalprotocol.com
   ACCESS_KEY_ID=your_access_key_id
   SECRET_ACCESS_KEY=your_secret_access_key
   ```

### Running the Server
Start the server with:

```bash
node server.js
```

### API Endpoints
#### List Buckets

GET /

```bash
curl -H "x-access-key-id: your_access_key_id" -H "x-secret-access-key: your_secret_access_key" http://localhost:3000/
````

#### Create Bucket  
PUT /:bucket

```bash
curl -X PUT -H "x-access-key-id: your_access_key_id" -H "x-secret-access-key: your_secret_access_key" http://localhost:3000/your-bucket-name
```

#### List Objects in Bucket
GET /:bucket

```bash
curl -H "x-access-key-id: your_access_key_id" -H "x-secret-access-key: your_secret_access_key" http://localhost:3000/your-bucket-name
```
#### Upload File

PUT /:bucket/:key

```bash
curl -X PUT -H "x-access-key-id: your_access_key_id" -H "x-secret-access-key: your_secret_access_key" -F "file=@/path/to/your/file" http://localhost:3000/your-bucket-name/your-file-name
```

#### Download File

GET /:bucket/:key
```bash
curl -H "x-access-key-id: your_access_key_id" -H "x-secret-access-key: your_secret_access_key" -o /path/to/save/file http://localhost:3000/your-bucket-name/your-file-name
```
#### Delete File [not implemented yet]
DELETE /:bucket/:key
```bash
curl -X DELETE -H "x-access-key-id: your_access_key_id" -H "x-secret-access-key: your_secret_access_key" http://localhost:3000/your-bucket-name/your-file-name
```

