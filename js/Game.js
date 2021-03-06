class Game
{
    constructor(level, wave)
    {
        this.castle = new Castle(level, window.castle);
        this.wave = wave;
        this.livingBeaver = 0;
        this.currency = starterscurrency;
        this.kills=0;
        this.inWave = false;
        this.beavers = [];

        //Update gui with correct currency
        document.getElementById("currency").innerHTML="$"+this.currency+",-";
    }

    startWave()
    {
        document.getElementById("nextwave").setAttribute('disabled', 'disabled');
        this.inWave = true;
        let j = 1;

        for(let i = 3 * this.wave; i >= 0; i--)
        {
            setTimeout(function(){ Game.spawnBeaver(); }, j * 500);
            this.livingBeaver++;
            j++;
        }
    }

    endWave()
    {
        document.getElementById("nextwave").removeAttribute("disabled");
        this.wave++;
        document.getElementById("nextwave").innerHTML="Start wave "+this.wave.toString();
        this.inWave = false;
        busters();
    }

    static spawnBeaver()
    {
        console.log('Spawning Beaver!');
        let beaver = new Beaver('models/slimer/slimer.png', 'melee', 1);
        beaver.create();
        let beaverObject = beaver.getObject();
        beaverObject.currentStep = beaver.currentStep;
        beaverObject.nextStep = beaver.nextStep;
        beaverObject.setNodes = beaver.setNodes;
        beaverObject.stats = beaver.stats;
        beaverObject.end = beaver.end;
        console.log(beaverObject);
        beavers.push(beaverObject);
        scene.add(beaverObject);
    }

    deleteMonster(index, removeLife) {
        //Beaver hits castle
        if (removeLife)
        {
            console.log('Castle HP -1');
            this.castle.damageCastle();
        }
        //Tower/castle kills beaver
        else
        {
            console.log('Death by turret');
            this.kills++;
            document.getElementById("kills").innerHTML=this.kills.toString();
            this.currency+=beavers[index].stats.currency;
            document.getElementById("currency").innerHTML="$"+this.currency+",-";
        }
        this.livingBeaver--;
        scene.remove(beavers[index]);
        delete beavers[index];
    }
}


