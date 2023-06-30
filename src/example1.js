/**
 * wallet1 listing erc1155
 * wallet3 buy it
 */
const path = require('path');
const { PK_WALLET1, PK_WALLET3 } = require('dotenv').config({
  path: path.resolve(...[__dirname, '../.env.local']),
})?.parsed;
const action = require('./actions.js');
const pk1ListingPk2TakeListing = async (PK1, PK2) => {
  const orderWithCounter = await action.listing(PK1);
  console.log('orderWithCounter is:');
  console.log(JSON.stringify(orderWithCounter, null, 2));
  console.log();
  await action.takeListing(PK2, orderWithCounter);
};
const pk1OfferPk2TakeOffer = async (PK1, PK2) => {
  const orderWithCounter = await action.offer(PK1);
  console.log('orderWithCounter is:');
  console.log(JSON.stringify(orderWithCounter, null, 2));
  console.log();
  await action.takeOffer(PK2, orderWithCounter);
};
const main = async () => {
  await pk1ListingPk2TakeListing(PK_WALLET3, PK_WALLET1);
  // await pk1OfferPk2TakeOffer(PK_WALLET1, PK_WALLET3);
};
main();
