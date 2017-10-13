class Beaver extends NPC
{
    constructor(texture, division, scale)
    {
        super(texture, division, scale);
        this.object = undefined;
        this.stats = {};
        this.stats.hp = 15;
        this.stats.hp = 15;
        this.stats.hp_100 = 15;
        this.stats.speed = 0.125;
        this.stats.currency = 1;
        this.size = {};
        this.size.x = tileSize;
        this.size.y = tileSize * 2;
        this.size.z = tileSize;
        this.position = {};
        this.position.x = 10;
        this.position.y = 4.25;
        this.position.z = 0;
        this.scale = scale;

        // Store movement for this monster
        this.currentStep = {};
        this.nextStep = {};
        this.end = {};

    }

    create() {
        let texture = new THREE.ImageUtils.loadTexture(this.texture)
        let material = new THREE.MeshLambertMaterial ({
            map: texture
        });
        let geometry = new THREE.SphereGeometry(this.size.x, this.size,y, this.size.z);

        // should reference obj
        // let refObject = window.

        this.object = new THREE.Mesh(geometry, material);
        this.object.position.set(this.position.x, this.position.y, this.position.z);
        this.object.scale.x = this.scale;
        this.object.scale.y = this.scale;
        this.object.scale.z = this.scale;
        this.currentStep.x = 0;
        this.currentStep.z = 0;
        this.setNodes();
    };

    setNodes = function() {
    if (this.nextStep.x !== undefined) {
        this.currentStep.x = this.nextStep.x;
        this.currentStep.y = this.nextStep.y;
    }

    // calculate next tile/step with a*
    Graph.nodes = nodes;
    let start = nodes[this.currentStep.x][this.currentStep.y];
    let end = nodes[this.end.x][this.end.y];
    let result = astar.search(Graph.nodes, start, end);
    if (result !== '') {
        this.nextStep.x = result[0].x;
        this.nextStep.y = result[0].y;
    }
}


}

