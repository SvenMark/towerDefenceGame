class Terrain
{
    constructor()
    {

        let heightmapImage = new Image();
        heightmapImage.src = 'images/heightmap.png';

        let material = THREE.Terrain.generateBlendedMaterial([
            // The first texture is the base; other textures are blended in on top.
            {texture: THREE.ImageUtils.loadTexture('images/sand1.jpg')},
            // Start blending in at height -80; opaque between -35 and 20; blend out by 50
            {texture: THREE.ImageUtils.loadTexture('images/grass1.jpg'), levels: [-80, -35, 20, 50]},
            {texture: THREE.ImageUtils.loadTexture('images/stone1.jpg'), levels: [20, 50, 60, 85]},
            // How quickly this texture is blended in depends on its x-position.
            {texture: THREE.ImageUtils.loadTexture('images/snow1.jpg'),  glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)'},
            // Use this texture if the slope is between 27 and 45 degrees
            {texture: THREE.ImageUtils.loadTexture('images/stone1.jpg'), glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2'}
        ]);

        // Generate a terrain
        let xS = 55, yS = 55;
        let terrainScene = THREE.Terrain({
            easing: THREE.Terrain.InEaseOut,
            frequency: 2.5,
            heightmap: THREE.Terrain.PerlinLayers,
            material: material,
            maxHeight: 20,
            minHeight: -20,
            steps: 1,
            useBufferGeometry: false,
            xSegments: xS,
            xSize: 512,
            ySegments: yS,
            ySize: 512,
        });
        // Assuming you already have your global scene, add the terrain to it
        scene.add(terrainScene);

        // Optional:
        // Get the geometry of the terrain across which you want to scatter meshes
        let mesh = this.buildTree();
        let geo = terrainScene.children[0].geometry;
        // Add randomly distributed foliage
        let decoScene = THREE.Terrain.ScatterMeshes(geo, {
            mesh: mesh,
            w: xS,
            h: yS,
            spread: 0.02,
            randomness: Math.random,
        });
        terrainScene.add(decoScene);
    }

    buildTree() {
        let material = [
            new THREE.MeshLambertMaterial({ color: 0x3d2817 }), // brown
            new THREE.MeshLambertMaterial({ color: 0x2d4c1e }), // green
        ];

        let c0 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6, 1, true));
        c0.position.y = 6;
        let c1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 14, 8));
        c1.position.y = 18;
        let c2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 9, 13, 8));
        c2.position.y = 25;
        let c3 = new THREE.Mesh(new THREE.CylinderGeometry(0, 8, 12, 8));
        c3.position.y = 32;

        let g = new THREE.Geometry();
        c0.updateMatrix();
        c1.updateMatrix();
        c2.updateMatrix();
        c3.updateMatrix();
        g.merge(c0.geometry, c0.matrix);
        g.merge(c1.geometry, c1.matrix);
        g.merge(c2.geometry, c2.matrix);
        g.merge(c3.geometry, c3.matrix);

        let b = c0.geometry.faces.length;
        for (let i = 0, l = g.faces.length; i < l; i++) {
            g.faces[i].materialIndex = i < b ? 0 : 1;
        }

        let m = new THREE.Mesh(g, material);

        m.scale.x = m.scale.z = 5;
        m.scale.y = 1.25;
        return m;
    }
}

