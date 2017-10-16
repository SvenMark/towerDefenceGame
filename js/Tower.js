class Tower
{

    //Hoe update je health in de GUI:
    //  document.getElementById("health").value = Nieuwe Health hoeveelheid;
    //  document.getElementById("healthtxt").innerHTML = Nieuwe Health hoeveelheid + %;

    constructor(level, object)
    {
        this.object = object;
        this.stats = {};
        this.stats.level = level;
        this.stats.hp = 100;

        let tower  = this.object;
        tower.scale.multiplyScalar(0.2);
        tower.position.set(10,0,-4.5);
        scene.add(tower);
    }

    damageTower()
    {
        this.stats.hp--;
    }

}


