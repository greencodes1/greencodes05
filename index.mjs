import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask } from '@reach-sh/stdlib/ask.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(startingBalance)
const accBobs = await stdlib.newTestAccounts(6, startingBalance);
const GreenNFT = await stdlib.launchToken(accAlice, "GreenNFT", "GNFT1", { supply: 1 });

const ctcAlice = accAlice.contract(backend);

const showTokenBalance = async (acc, name) => {
    const amtNFT = await stdlib.balanceOf(acc, GreenNFT.id);
    console.log(`${name} has ${amtNFT} of the NFT`);
};
const ctcWho = (who) =>
    who.contract(backend, ctcAlice.getInfo());
const numofticks = await ask('what is the max amount of ticket entries: ')
const Bobs = async (whoi, num) => {
    try {
        const ctc = ctcWho(whoi);
        whoi.tokenAccept(GreenNFT.id)
        const ticket = Math.floor(Math.random() * parseInt(numofticks))
        await ctc.apis.Bob.bobticketnumber(ticket);

    } catch (error) {
        console.log(error);
    }

}


console.log('Starting backends...');
await showTokenBalance(accAlice, 'Alice')
await showTokenBalance(accBobs[0], 'Nick')
await showTokenBalance(accBobs[1], 'chikamso')
await showTokenBalance(accBobs[2], 'Dera')
await showTokenBalance(accBobs[3], 'jeffery')
await showTokenBalance(accBobs[4], 'darren')
await showTokenBalance(accBobs[5], 'steve')
const winnumber = await ask('what is the winning number')
await Promise.all([
    backend.Alice(ctcAlice, {
        ...stdlib.hasRandom,
        nft: GreenNFT.id,
        winner: parseInt(winnumber),
        hashvalue: async (hashvalue) => {
            console.log(` The hashed value of winning number: ${hashvalue}`)
        },
        numberoftickets: async () => {
            console.log(` Max ticket number enteries is ${numofticks}`)
            return parseInt(numofticks)
        },
    }),
    await Bobs(accBobs[0]),
    await Bobs(accBobs[1]),
    await Bobs(accBobs[2]),
    await Bobs(accBobs[3]),
    await Bobs(accBobs[4]),
    await Bobs(accBobs[5])
]);
await showTokenBalance(accAlice, 'Alice')
await showTokenBalance(accBobs[0], 'Nick')
await showTokenBalance(accBobs[1], 'chikamso')
await showTokenBalance(accBobs[2], 'Dera')
await showTokenBalance(accBobs[3], 'jeffery')
await showTokenBalance(accBobs[4], 'darren')
await showTokenBalance(accBobs[5], 'steve')


process.exit()
