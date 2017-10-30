class Terrain
{
    constructor()
    {
        let material = THREE.Terrain.generateBlendedMaterial([
            // The first texture is the base; other textures are blended in on top.
            {texture: THREE.ImageUtils.loadTexture('images/sand1.jpg')},
            // Start blending in at height -80; opaque between -35 and 20; blend out by 50
            {texture: THREE.ImageUtils.loadTexture('images/grass1.jpg'), levels: [-80, -35, 60, 80]},
            {texture: THREE.ImageUtils.loadTexture('images/stone1.jpg'), levels: [40, 70, 80, 105]},
            // How quickly this texture is blended in depends on its x-position.
            {texture: THREE.ImageUtils.loadTexture('images/snow1.jpg'),  glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)'},
            // Use this texture if the slope is between 27 and 45 degrees
            {texture: THREE.ImageUtils.loadTexture('images/stone1.jpg'), glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2'}
        ]);

        //Source our heightmap
        let heightmap = new Image();
        heightmap.src = 'images/heightmap.png';

        //Load the heightmap, and when its loaded create the terrain
        heightmap.onload = function() {create()};

        //Generate a terrain according to our heightmap
        function create()
        {
            let terrain = THREE.Terrain({
                easing: THREE.Terrain.Linear,
                frequency: 2.5,
                heightmap: heightmap,
                material: material,
                maxHeight: 170,
                minHeight: -20,
                steps: 8,
                useBufferGeometry: false,
                xSegments: 127,
                xSize: 3072,
                ySegments: 127,
                ySize: 3072,
            });

/*            let water = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(16384+1024, 16384+1024, 16, 16),
                new THREE.MeshLambertMaterial({color: 0x006ba0, transparent: true, opacity: 0.6})
            );
            water.position.y = 8;
            water.rotation.x = -0.5 * Math.PI;
            scene.add(water);*/

            // Get the geometry of the terrain across which you want to scatter meshes
            let mesh = buildTree();
            let geo = terrain.children[0].geometry;
            //Add trees
            let trees = THREE.Terrain.ScatterMeshes(geo, {
                mesh: mesh,
                w: 127,
                h: 127,
                spread: 0.02,
                randomness: Math.random,
            });
            //Add the trees to the terrain
            terrain.add(trees);

            //Add the terrain to the scene
            scene.add(terrain);

            function buildTree()
            {
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

    }
}

