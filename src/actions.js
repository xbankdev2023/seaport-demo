const { NFT_TOKEN_ADDRESS, NFT_TOKEN_ID, WETH } =
  require('dotenv').config()?.parsed;
const signale = require('signale');
const { seaportBootstrap } = require('./utils');
const { parseEther, hexValue } = require('ethers/lib/utils.js');
const listing = async (PK) => {
  try {
    const { seaport, offerer } = await seaportBootstrap(PK);
    const { executeAllActions } = await seaport.createOrder({
      offer: [
        {
          itemType: 3,
          token: NFT_TOKEN_ADDRESS,
          identifier: NFT_TOKEN_ID,
          amount: '1',
        },
      ],
      consideration: [
        {
          amount: parseEther('0.001').toString(),
          recipient: offerer,
        },
      ],
      allowPartialFills: true,
    });
    const orderWithCounter = await executeAllActions();
    return orderWithCounter;
  } catch (e) {
    signale.error(e);
  }
};
const takeListing = async (PK, orderWithCounter, gasLimit = 999999) => {
  gasLimit = hexValue(gasLimit);
  const { seaport, offerer } = await seaportBootstrap(PK);
  const { actions } = await seaport.fulfillOrder({
    order: orderWithCounter,
    accountAddress: offerer,
  });
  if (actions[0].type === 'exchange') {
    const tx = await actions[0].transactionMethods.transact({
      gasLimit,
    });
    console.log('tx hash is:');
    console.log(tx.hash);
    console.log();
    const receipt = await tx.wait();
    console.log('receipt is:');
    console.log(JSON.stringify(receipt, null, 2));
  } else {
    signale.error('actions.0.type !== exchange');
  }
};

const offer = async (PK) => {
  try {
    const { seaport, offerer } = await seaportBootstrap(PK);
    const { executeAllActions } = await seaport.createOrder({
      offer: [
        {
          amount: parseEther('0.001').toString(),
          token: WETH,
        },
      ],
      consideration: [
        {
          itemType: 3,
          token: NFT_TOKEN_ADDRESS,
          identifier: NFT_TOKEN_ID,
          amount: '1',
          recipient: offerer,
        },
      ],
      allowPartialFills: true,
    });
    const orderWithCounter = await executeAllActions();
    return orderWithCounter;
  } catch (e) {
    signale.error(e);
  }
};

const takeOffer = async (PK, orderWithCounter, gasLimit = 999999) => {
  gasLimit = hexValue(gasLimit);
  const { seaport, offerer } = await seaportBootstrap(PK);
  const { actions } = await seaport.fulfillOrder({
    order: orderWithCounter,
    accountAddress: offerer,
  });
  if (actions[0].type === 'exchange') {
    const tx = await actions[0].transactionMethods.transact({
      gasLimit,
    });
    console.log('tx hash is:');
    console.log(tx.hash);
    console.log();
    const receipt = await tx.wait();
    console.log('receipt is:');
    console.log(JSON.stringify(receipt, null, 2));
  } else {
    signale.error('actions.0.type !== exchange');
  }
};

module.exports = {
  listing,
  takeListing,
  offer,
  takeOffer,
};
