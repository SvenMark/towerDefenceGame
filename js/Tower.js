class Tower
{
    constructor(level, object)
    {
        this.object = object;
        this.stats = {};
        this.stats.level = level;

        //Set tower position and scale
        this.object.position.set(clickedobject.object.position.x, 0, clickedobject.object.position.z);
        this.object.scale.multiplyScalar(0.4);

        //Tower name for debug reasons
        this.name=("Tower #"+towercount).toString();

        //Add the tower to the scene
        scene.add(this.object);
        console.log("Tower #"+ towercount +" Placed");

        //Tell the tile it is now occupied
        clickedobject.occupied=0;
    }


    upgradetower()
    {
        this.stats.level++;
        console.log(this.name +" Upgraded to level "+this.stats.level);
        document.getElementById("upgradetower").style.display = 'none';
        scene.remove(indicator);
    }
}