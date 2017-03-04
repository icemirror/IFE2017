(function () {
    //THREE三要素：场景、摄像机、渲染器
    var scene, camera, renderer;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(2.41, 1.2, 1.66);
    //camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(10, 0, 0));
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: "highp"
    });
    //setSize()  统一设置width和style-width，canvas.width = displayWidth
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x666666);
    renderer.shadowMap.enabled = true; //开启阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; //开启阴影柔滑

    //将渲染器中的dom添加到body中
    document.body.appendChild(renderer.domElement);

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

    //plane  接受光影的投射平面
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


    //添加聚光灯
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

    // 加点环境光，调整整体明亮度
    var ambientLight = new THREE.AmbientLight(0x515151);
    scene.add(ambientLight);

    //PS  所有需要显示的元素都要加入scene中

    //render 最后一步，把所有的场景元素都展示（渲染）出来
    var render = function () {
        renderer.render(scene, camera);
    }

    render();

})();