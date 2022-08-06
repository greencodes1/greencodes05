'reach 0.1';
const [isOutcome, WINNER, NOWINNER] = makeEnum(2)
const getwinner = (num1, num2) => {
    if (num1 === num2) {
        return WINNER
    } else {
        return NOWINNER
    }
}
assert(getwinner(0, 0) == WINNER)
assert(getwinner(1, 2) == NOWINNER)
export const main = Reach.App(() => {
    const Alice = Participant('Alice', {
        ...hasRandom,
        nft: Token,
        hashvalue: Fun([Digest], Null),
        winner: UInt,
        numberoftickets: Fun([], UInt)
    });
    const Bob = API('Bob', {
        bobticketnumber: Fun([UInt], Null)
    });
    init();

    Alice.only(() => {
        const nftid = declassify(interact.nft)
        const NOTs = declassify(interact.numberoftickets())
    })
    Alice.publish(nftid, NOTs)
    commit()
    Alice.only(() => {
        const _winnernumber = interact.winner
        const [_commitwinnernumber, _saltwinnernumber] = makeCommitment(interact, _winnernumber)
        const commitwinnernumber = declassify(_commitwinnernumber)
    })
    Alice.publish(commitwinnernumber)
    commit()

    Alice.only(() => {
        const viewhash = declassify(interact.hashvalue(commitwinnernumber))
    })
    Alice.publish(viewhash)
    const addresstorage = new Map(Address, UInt)
    const [i, addresses, ticketsnumbers] =
        parallelReduce([0, Array_replicate(6, Alice), Array_replicate(6, 1)])
            .invariant(balance(nftid) == 0)
            .while(i < 6)
            .api(
                Bob.bobticketnumber,
                (tn, k) => {
                    k(null)
                    const who = this
                    addresstorage[who] = tn
                    return [i + 1, addresses.set(i, this), ticketsnumbers.set(i, tn)]
                }
            )
    commit()
    Alice.only(() => {
        const saltwinnernumber = declassify(_saltwinnernumber)
        const winnernumber = declassify(_winnernumber)
    })
    Alice.publish(saltwinnernumber, winnernumber)
    checkCommitment(commitwinnernumber, saltwinnernumber, winnernumber)
    var [users, api_addresses, api_ticketnumbers] = [0, addresses, ticketsnumbers]
    invariant(balance(nftid) == 0)
    while (users < 6) {
        commit()
        Alice.publish()
        const outcome = getwinner(winnernumber, api_ticketnumbers[users])
        if (outcome == WINNER) {
            commit()
            Alice.pay([[1, nftid]])
            transfer([[1, nftid]]).to(api_addresses[users])
            users = users + 1
            continue
        } else {
            users = users + 1
            continue
        }

    }
    transfer(balance()).to(Alice)
    commit()
    exit();
});
