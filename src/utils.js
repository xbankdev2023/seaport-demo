const path = require('path');
const { RPC } = require('dotenv').config({
  path: path.resolve(...[__dirname, '../.env.local']),
})?.parsed;
const ethers = require('ethers');
const { Seaport } = require('@opensea/seaport-js');

const seaportBootstrap = async (pk) => {
  if (!pk) {
    throw new Error('缺少私钥');
  }
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(pk, provider);
  const offerer = await wallet.getAddress();
  console.log('offerer:');
  console.log(offerer);
  console.log();
  const seaport = new Seaport(wallet);
  return { seaport, offerer, wallet };
};

module.exports = {
  seaportBootstrap,
};
