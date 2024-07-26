import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrapper/MainContract";
import "@ton-community/test-utils";

describe("main.fc contract test", () => {
    
    it("should get the proper most recent sender address", async () => {
        // Membuat instansi blockchain
        const blockchain = await Blockchain.create();
        
        // Mengambil kode cell dari hex
        const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
        
        // Membuka kontrak
        const myContract = blockchain.openContract(
            await MainContract.createFromConfig({}, codeCell)
        );
        
        // Mengambil wallet sender
        const senderWallet = await blockchain.treasury("sender");
        
        // Mengirim pesan internal
        const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(), toNano("0.05"));
       
        // Memeriksa hasil transaksi
        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        // Memanggil getData sebagai fungsi
        const data = await myContract.getData(); // Pastikan memanggil getData sebagai fungsi
        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
    });
});
