"use strict";
function main() {
    const options = {
        loops: Math.pow(10, 6),
    };
    const expirementsHostCases = [
        { Name: "hostTrue", Result: expirementsInit(), host: true },
        { Name: "hostFalse", Result: expirementsInit(), host: false },
    ];
    const expirementsHostWrapCases = expirementsHostCasesWrap(expirementsHostCases, options);
    console.log(JSON.stringify(expirementsHostWrapCases, null, 2));
}
function expirementsHostCasesWrap(expirementsHostCases, options) {
    expirementsHostCases.forEach(expirementsHostCase => {
        let expirements = expirementsInit();
        for (let i = 0; i < options.loops; i++) {
            expirements = game(expirements, false, expirementsHostCase.host);
            expirements = game(expirements, true, expirementsHostCase.host);
        }
        expirementsHostCase.Result = expirements;
    });
    return expirementsHostCases;
}
function expirementsInit() {
    return {
        curtains: [
            { name: "curtain1", prize: { name: "", win: false }, chosen: false, chosenHost: false },
            { name: "curtain2", prize: { name: "", win: false }, chosen: false, chosenHost: false },
            { name: "curtain3", prize: { name: "", win: false }, chosen: false, chosenHost: false },
        ],
        prizes: [
            { name: "car", win: true },
            { name: "clown", win: false },
            { name: "goat", win: false },
        ],
        cases: {
            swapTrue: { wins: 0, losses: 0, loops: 0 },
            swapFalse: { wins: 0, losses: 0, loops: 0 },
        },
        expirementTemp: { win: false },
    };
}
function game(expirements, swap, allowHost = true) {
    newGame(expirements);
    chooseCurtain(expirements);
    if (allowHost) {
        hostChoice(expirements, swap);
    }
    playerSwap(swap, expirements);
    checkWin(expirements, swap);
    return expirements;
}
function checkWin(expirements, swap) {
    expirements.curtains.forEach(curtain => {
        if (curtain.chosen && curtain.prize.win) {
            if (swap) {
                expirements.cases.swapTrue.wins++;
                expirements.expirementTemp.win = true;
            }
            else {
                expirements.cases.swapFalse.wins++;
                expirements.expirementTemp.win = true;
            }
        }
    });
    if (!expirements.expirementTemp.win) {
        if (swap) {
            expirements.cases.swapTrue.losses++;
        }
        else {
            expirements.cases.swapFalse.losses++;
        }
    }
    if (swap) {
        expirements.cases.swapTrue.loops++;
    }
    else {
        expirements.cases.swapFalse.loops++;
    }
}
function playerSwap(swap, expirements) {
    if (swap) {
        expirements.curtains.forEach(curtain => {
            if (!curtain.chosen && !curtain.chosenHost) {
                expirements.curtains.forEach(curtain2 => {
                    curtain2.chosen = false;
                });
                curtain.chosen = true;
            }
        });
    }
}
function chooseCurtain(expirements) {
    const randomChoice = Math.floor(Math.random() * expirements.prizes.length);
    expirements.curtains[randomChoice].chosen = true;
}
function hostChoice(expirements, swap) {
    const hostOptions = [];
    expirements.curtains.forEach((curtain, i) => {
        if (!curtain.chosen && !curtain.prize.win) {
            hostOptions.push(i);
        }
    });
    const randomChoice = hostOptions[Math.floor(Math.random() * hostOptions.length)];
    expirements.curtains[randomChoice].chosenHost = true;
}
function newGame(expirements) {
    expirements.expirementTemp.win = false;
    const randomPrizesOrder = expirements.prizes.sort(() => Math.random() - 0.5);
    expirements.curtains.forEach((curtain, i) => {
        curtain.chosen = false;
        curtain.chosenHost = false;
        curtain.prize = randomPrizesOrder[i];
    });
}
main();
