const prompt = require('prompt-sync')();

const Difficulty = {
    normal: { boxes: 4, gems: 3, bombs: 1 },
    medium: { boxes: 3, gems: 2, bombs: 1 },
    hard: { boxes: 3, gems: 1, bombs: 2 },
    impossible: { boxes: 4, gems: 1, bombs: 3 }
};


//aglorithm 
function CalculateRTP(difficulty, playerPoints, totalFloors) {
    const lowerCaseDifficulty = difficulty;
    const difficult = Difficulty[lowerCaseDifficulty];
    const GemProb = difficult.gems / difficult.boxes;

    let cumulativeWinProb = 1;
    let totalPayouts = 0;
    let basePayout = 2 * playerPoints;
    const EachFloorPayouts = [];
    const proability = [];

    //loop to calculate proability to get into each floor 
    for (let i = 1; i <= totalFloors; i++) {
        proability.push(Math.pow(GemProb, i));
    }

    //loop for calculation the cumulative proability to win and the payout for each floor along with total payouts.
    for (let floor = 1; floor <= totalFloors; floor++) {
        cumulativeWinProb *= GemProb;

        const floorPayout = basePayout * floor;
        EachFloorPayouts.push(floorPayout);

        totalPayouts += floorPayout * cumulativeWinProb;
    }

    //calculating the rtp 
    let rtp = (totalPayouts / playerPoints) * 100;

    //condition for rtp adjustment
    if (rtp > 98 / rtp < 98) {
        const adjustmentFactor = 98 / rtp;

        for (let i = 0; i < EachFloorPayouts.length; i++) {
            EachFloorPayouts[i] *= adjustmentFactor;
        }
        rtp = 98;
    }

    return {
        cumulativeWinProb: cumulativeWinProb.toFixed(10) * 100 + "%",
        proability: proability,
        EachFloorPayouts: EachFloorPayouts,
        rtp: rtp.toFixed(2)
    };

}



function Display() {
    const playerPoints = parseInt(prompt("Enter your player points:"));
    const totalFloors = parseInt(prompt("Enter the total number of floors:"));
    const difficult = prompt("Enter the difficulty level: ");
    const result = CalculateRTP(difficult, playerPoints, totalFloors);

    for (let i = 0; i < totalFloors; i++) {
        console.log(`\n\nFLOOR ${i}:\nwin proability: ${result.proability[i]*100}% \nfloor payout: ${result.EachFloorPayouts[i]}`)
    }


    console.log(`\n\n RESULT: \n cummulative win proability : ${result.cumulativeWinProb} \n RTP: ${result.rtp}%`);

}


Display()