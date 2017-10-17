class Game
{
    constructor(level, wave)
    {
        this.tower = new Tower(level, window.tower);
        this.wave = wave;
        this.currency = 10;
        this.kills=0;
        this.inWave = false;
        this.knights = [];
        this.beavers = [];
    }

    startWave()
    {
        document.getElementById("nextwave").setAttribute('disabled', 'disabled');
        this.inWave = true;
        for(let i = 5 * this.wave; i >= 0; i--)
        {
            setTimeout(function(){ Game.spawnBeaver(); }, 10000);
        }
    }

    endWave()
    {
        document.getElementById("nextwave").removeAttribute("disabled");
        this.wave++;
        document.getElementById("nextwave").innerHTML="Start wave "+this.wave.toString();
        this.inWave = false;
    }

    static spawnBeaver()
    {
        console.log('Spawning Beaver!');
        let beaver = new Beaver('models/ghost.png', 'melee', 0.420);
        beaver.create();
        let beaverObject = beaver.getObject();
        beaverObject.currentStep = beaver.currentStep;
        beaverObject.nextStep = beaver.nextStep;
        beaverObject.setNodes = beaver.setNodes;
        beaverObject.stats = beaver.stats;
        beaverObject.end = beaver.end;
        console.log(beaverObject.currentStep);
        console.log(beaverObject.nextStep);
        beavers.push(beaverObject);
        scene.add(beaverObject);
    }

    deleteMonster(index, removeLife) {
        if (removeLife) {
            //removelife duh
            console.log('Leven -1');
            this.tower.damageTower();
        }
        else {
            //kapoet add monezz
            console.log('Dood door turret');
            this.kills++;
            document.getElementById("kills").innerHTML=this.kills.toString();
            this.currency+=beavers[index].stats.currency;
            document.getElementById("currency").innerHTML="€"+this.currency+",-";
        }
        scene.remove(beavers[index]);
        delete beavers[index];
    }
}


