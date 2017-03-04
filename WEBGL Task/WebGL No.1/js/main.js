(function () {
    //THREE三要素：场景、摄像机、渲染器
    var scene, camera, renderer;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(5, 3, 4);
    //camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: "highp"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x666666);

    //将渲染器中的dom添加到body中
    document.body.appendChild(renderer.domElement);

    //cube
    var cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1), new THREE.MeshPhongMaterial({
        color: 0xffffff
    }));
    scene.add(cube);

    //wheel
    var createWheel = function (arg) {
        arg.name = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 35, 35), new THREE.MeshPhongMaterial({
            color: 0xffffff
        }));
        arg.name.position.set(arg.x, arg.y, arg.z);
        scene.add(arg.name);
    }
    createWheel({
        name: 'wheelLB',
        x: 0.4,
        y: -0.5,
        z: 0.47
    });
    createWheel({
        name: 'wheelLT',
        x: -0.4,
        y: -0.5,
        z: 0.47
    });
    createWheel({
        name: 'wheelRB',
        x: 0.4,
        y: -0.5,
        z: -0.47
    });
    createWheel({
        name: 'wheelRT',
        x: -0.4,
        y: -0.5,
        z: -0.47
    });

    //text
    var fontLoader = new THREE.FontLoader();
    fontLoader.load('../fonts/helvetiker_regular.typeface.json', function (font) {
        var mesh = new THREE.Mesh(new THREE.TextGeometry('Hello', {
            font: font,
            size: 10,
            height: 10
        }), new THREE.MeshPhongMaterial({
            color: 0xffffff
        }));
        mesh.position.set(0, 0, 5);
        scene.add(mesh);
    });

    //light
    // 旋转 跳跃 我闭上眼 （来点灯光）
    var ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0x989898);
    directionalLight.position.set(5, 6, 4)
    scene.add(directionalLight);

    //PS  所有需要显示的元素都要加入scene中

    //render
    
    //最后一步，把所有的场景元素都展示（渲染）出来
    var render = function () {
        renderer.render(scene, camera);
    }

    render();

})();