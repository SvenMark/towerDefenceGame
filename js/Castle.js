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
        this.stats.hp -= 10;
        document.getElementById("healthtxt").innerHTML=this.stats.hp+"%";
        document.getElementById("healthbar").style.width = this.stats.hp+"%";

        if (this.stats.hp === 0) {
            alert('You Lose!');
            location.reload();
        }
    }
}


