class Tower
{
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


