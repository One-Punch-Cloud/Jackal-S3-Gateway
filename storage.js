import * as fs from 'node:fs';
import {
    MnemonicWallet,
    WalletHandler,
    FileUploadHandler,
    FileDownloadHandler,
} from '@jackallabs/jackal.nodejs';
import 'dotenv/config';

const signerChain = process.env.SIGNER_CHAIN;
const mnemonic = process.env.MNEMONIC;
const queryAddr = process.env.QUERY_ADDR;
const txAddr = process.env.TX_ADDR;

const testnet = {
    signerChain,
    queryAddr,
    txAddr
};

export async function initJackal() {
    const m = await MnemonicWallet.create(mnemonic);
    const wallet = await WalletHandler.trackWallet(testnet, m);
    return wallet;
}

export async function createBucket(wallet, bucketName) {
    const fileIo = await wallet.makeFileIoHandler('1.1.x');
    if (!fileIo) throw new Error('No FileIo');

    await fileIo.generateInitialDirs(null, [bucketName]);
    await fileIo.verifyFoldersExist([bucketName]);
}

export async function uploadFile(wallet, bucketName, fileBuffer, fileName) {
    const fileIo = await wallet.makeFileIoHandler('1.1.x');
    if (!fileIo) throw new Error('No FileIo');

    const dir = await fileIo.downloadFolder("s/" + bucketName);
    const file = new File([fileBuffer], fileName, { type: "application/octet-stream" });

    const handler = await FileUploadHandler.trackFile(file, dir.getMyPath());
    const uploadList = {
        [fileName]: {
            data: null,
            exists: false,
            handler: handler,
            key: fileName,
            uploadable: await handler.getForUpload()
        }
    };

    const tracker = { timer: 0, complete: 0 };
    await fileIo.staggeredUploadFiles(uploadList, dir, tracker);
}

export async function downloadFile(wallet, bucketName, fileName) {
    const fileIo = await wallet.makeFileIoHandler('1.1.x');
    if (!fileIo) throw new Error('No FileIo');

    const dir = await fileIo.downloadFolder("s/" + bucketName);
    const dl = await fileIo.downloadFile({
        rawPath: dir.getMyChildPath(fileName),
        owner: wallet.getJackalAddress()
    }, {
        track: 0
    });

    return new Uint8Array(await dl.receiveBacon().arrayBuffer());
}

export async function listFiles(wallet, bucketName) {
    const fileIo = await wallet.makeFileIoHandler('1.1.x');
    if (!fileIo) throw new Error('No FileIo');

    const dir = await fileIo.downloadFolder("s/" + bucketName);
    return dir.getChildrenNames();
}

// TODO: Check Jackal sources to figure out how to implement that
export async function deleteFile(wallet, bucketName, fileName) {
    // Wasn't able to find an example of deleting files from Jackal chain
}
