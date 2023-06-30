const path = require('path');
const { WETH } = require('dotenv').config({
  path: path.resolve(...[__dirname, '../.env']),
})?.parsed;
const { PK_WALLET1 } = require('dotenv').config({
  path: path.resolve(...[__dirname, '../.env.local']),
})?.parsed;
const ethers = require('ethers');
const abi = require('./abi.js');
const { seaportBootstrap } = require('./utils.js');
const { parseEther, formatEther, hexValue } = ethers.utils;

const main = async () => {
  const { wallet, offerer } = await seaportBootstrap(PK_WALLET1);
  const wethContract = new ethers.Contract(WETH, abi.WETH, wallet);

  const currentBalance = await wethContract.balanceOf(offerer);
  console.log('当前weth余额:');
  console.log(formatEther(currentBalance));
  console.log();

  const fnData = wethContract.interface.encodeFunctionData('deposit');
  const tx = await wallet.sendTransaction({
    to: WETH,
    data: fnData,
    value: parseEther('0.002'),
  });
  console.log('当前交易hash:');
  console.log(tx.hash);
  console.log();

  const receipt = await tx.wait();
  console.log('receipt is:');
  console.log(JSON.stringify(receipt, null, 2));
  console.log();

  const balance = await wethContract.balanceOf(offerer);
  console.log('交易后的weth余额:');
  console.log(formatEther(balance));
};

main();
