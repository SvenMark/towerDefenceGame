class Tower
{
    constructor(level, object)
    {
        this.level = level;
        this.object = object;

        //Perfect tower
        object.scale.multiplyScalar(0.2);
        object.position.set(10,0,-4.5);
        scene.add(object);
    }

}


