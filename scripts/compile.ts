import * as fs from "fs";
import process from "process";
import { Cell } from "ton-core";
import { compileFunc } from "@ton-community/func-js";

async function compileScript() {
    console.log("#################################################################################");
    console.log("Compile script is running, let's find some FunC code to compile..");

    const compileResult = await compileFunc({
        targets: ["./contracts/main.fc"],
        sources: (x) => fs.readFileSync(x).toString("utf8"),
    });

    if (compileResult.status === "error") {
        console.log(" -- OH NO! Compilation Errors! The compiler output was:");
        console.log(compileResult.message);
        process.exit(1);
    }

    console.log("Compilation successful!");

    const hexArtifact = 'build/main.compiled.json';

    // Convert codeBoc to hexadecimal
    const cell = Cell.fromBoc(Buffer.from(compileResult.codeBoc, "base64"))[0];
    const hexCode = cell.toBoc().toString("hex");

    fs.writeFileSync(
        hexArtifact,
        JSON.stringify({
            hex: hexCode,
        })
    );
    console.log(" -- Compiler code saved to " + hexArtifact);
}

compileScript();
