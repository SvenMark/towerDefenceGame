class Castle
{
    constructor(level, object)
    {
        this.object = object;
        this.stats = {};
        this.stats.level = level;
        this.stats.hp = 100;

        let castle  = this.object;
        castle.scale.multiplyScalar(0.1);
        castle.position.set(10,0,-6);
        scene.add(castle);
    }

    damageCastle()
    {
        this.stats.hp -= 5;
        document.getElementById("healthtxt").innerHTML=this.stats.hp+"%";
        document.getElementById("healthbar").style.width = this.stats.hp+"%";

        if (this.stats.hp === 0) {
            gameover();
            document.getElementById("killnumber").innerHTML=game.kills.toString();
        }
    }
}


