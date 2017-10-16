class Tower
{

    //Hoe update je health in de GUI:
    //  document.getElementById("health").value = Nieuwe Health hoeveelheid;
    //  document.getElementById("healthtxt").innerHTML = Nieuwe Health hoeveelheid + %;

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


