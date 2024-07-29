import { beginCell, Cell, contractAddress, StateInit, storeAccountState, storeStateInit, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import qs from "qs";
import qrcode from "qrcode-terminal";

async function deployScript() {
    console.log(
        "=================================================="
    );
    console.log("Deploy script is running, let's deploy our main.fc contract...");
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const dataCell = new Cell();

    const stateInit: StateInit = {
        code: codeCell,
        data: dataCell,
    };
    
    const stateInitBuilder = beginCell();
    storeStateInit(stateInit)(stateInitBuilder);
    const stateInitCell = stateInitBuilder.endCell();

    const address = contractAddress(0, {
        code: codeCell,
        data: dataCell,
    });

    console.log(
        `The address of the contract is following: ${address.toString()}`
    );
    console.log(`Please scan thr QR code below to deploy thr contract:`);

    let link =
    `https://test.tonhub.com/transfer/` +
    address.toString({
        testOnly: true,
    }) +
    "?" +
    qs.stringify({
        text: "Deploy contract",
        amount: toNano('0.05').toString(10),
        init: stateInitCell.toBoc({ idx: false }).toString("base64"),
    });

    qrcode.generate(link, { small: true }, (code) => {
        console.log(code);
    });

    //const stateInitCell = beginCell()
    //.storeBit(false) // split_depth - Parameter for the highload contracts, define behavior of
    //.storeBit(false) // special - Used for invoking smart contract in every new block of the blockchain
    //.storeMaybeRef(codeCell) // code - Contract serialized code.
    //.storeMaybeRef(dataCell) // data - Contaract initial data.
    //.storeUint(0, 1) // Library - Currently used StateInit without libs
    //.endCell();
}

deployScript()