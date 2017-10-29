class Castle
{
    constructor(level, object)
    {
        this.object = object;
        this.stats = {};
        this.stats.level = level;
        this.stats.hp = 100;

        let castle  = this.object;
        castle.scale.multiplyScalar(0.2);
        castle.position.set(10,0,-4.5);
        scene.add(castle);
    }

    damageCastle()
    {
        this.stats.hp--;
        document.getElementById("healthtxt").innerHTML=this.stats.hp+"%";
        document.getElementById("healthbar").style.width = this.stats.hp+"%";
        //If health 0, explode
    }
}


