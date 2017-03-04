(function () {
    var scene, camera, renderer, controls, stats;

    //stats
    stats = new Stats(); // 开启性能监视
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);

    //camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(2.41, 1.2, 1.66);
    //camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    //scene
    scene = new THREE.Scene();

    //texture
    var textureLoader = new THREE.TextureLoader(); //设置贴图

    //multiMaterial for cube (right,left,top,bottom,back,front)
    var cubeMaterials = [];
    for (var i = 0; i < 6; i++) {
        cubeMaterials.push(new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: textureLoader.load('../textures/' + (i + 1) + '.jpg', function () {
                render();
            }),
            overdraw: true
        }));
    }

    //cube
    var cube = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1), new THREE.MultiMaterial(cubeMaterials));
    cube.castShadow = true; //产生阴影
    scene.add(cube);

    //wheel
    var createWheel = function (arg) {
        var textureWheel = textureLoader.load('../assets/wheel.jpg', function (texture) {
            texturePlane.wrapS = texturePlane.wrapT = THREE.RepeatWrapping;
            textureWheel.repeat.set(2, 2);
            arg.name = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 35, 35), new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: texture
            }));
            arg.name.position.set(arg.x, arg.y, arg.z);
            arg.name.castShadow = true;
            scene.add(arg.name);
            render();
        });

    }
    createWheel({
        name: 'wheelLB',
        x: 0.5,
        y: -0.4,
        z: 0.47
    });
    createWheel({
        name: 'wheelLT',
        x: -0.5,
        y: -0.4,
        z: 0.47
    });
    createWheel({
        name: 'wheelRB',
        x: 0.5,
        y: -0.4,
        z: -0.47
    });
    createWheel({
        name: 'wheelRT',
        x: -0.5,
        y: -0.4,
        z: -0.47
    });

    //plane  
    //.load ( url, onLoad, onProgress, onError )
    var texturePlane = textureLoader.load('../assets/plane.jpg', function (texture) {
        texturePlane.wrapS = texturePlane.wrapT = THREE.RepeatWrapping; //指定重复方式
        texturePlane.repeat.set(6, 6); //重复次数
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 16, 16), new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture
        }));
        plane.rotation.x = -Math.PI / 2; //将平面旋转
        plane.position.set(-1, -0.7, 1.5); //调整平面空间位置
        plane.receiveShadow = true; //接受投影
        scene.add(plane);
        render();
    });


    //SpotLight
    var light = new THREE.SpotLight(0xcccccc, 1, 100, Math.PI / 6, 25);
    light.position.set(-1, 3.5, 6);
    light.target = cube; //将灯光目标定为cube
    light.castShadow = true; //开启聚光灯产生阴影
    light.shadow.camera.visible = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    //helper
    var helper = new THREE.CameraHelper(light.shadow.camera); //调试显示摄像机位置
    // scene.add(helper);

    // AmbientLight
    var ambientLight = new THREE.AmbientLight(0x515151);
    scene.add(ambientLight);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight; // 设置camera的视口宽高比
        camera.updateProjectionMatrix(); // 更新投影矩阵
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.handleResize();
        render();
    }

    function animate() {
        requestAnimationFrame(animate); // 递归
        controls.update(); // 更新鼠标控制
        stats.update(); // 更新性能监测
        render();
    }

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
        precision: "highp" // 高精度
    });
    //setSize()  canvas.width = displayWidth
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置canvas宽高和像素
    renderer.setClearColor(0x666666);
    renderer.shadowMap.enabled = true; //开启阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; //开启阴影柔滑
    renderer.setPixelRatio(window.devicePixelRatio); // 防止形变
    document.body.appendChild(renderer.domElement);
    
    //controls   TrackballControls(obj, domElement)
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 3.5; //旋转速度
    controls.zoomSpeed = 3.5; // 变焦速度
    controls.panSpeed = 3.5; // 平移速度
    controls.noZoom = false; // 开启变焦
    controls.noPan = false; // 开启移动
    controls.staticMoving = true; // 
    controls.dynamicDampingFactor = 0.1; //动态阻尼系数（灵敏度）
    controls.keys = [65, 83, 68]; // A-S-D
    controls.addEventListener('change', render);

    //render all
    function render() {
        renderer.render(scene, camera);
    }

    animate();

})();