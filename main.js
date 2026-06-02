import ("https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js").then((THREE) => {
import ('https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/GLTFLoader.js').then((GLTF) => {
//import ('https://cdn.jsdelivr.net/npm/three@0.184.0/examples/jsm/physics/RapierPhysics.js').then((Phys) => {
//Phys.RapierPhysics().then((physics) => {
//import (/*"https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/controls/OrbitControls.js"*/"https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/controls/DragControls.js"/*"https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/controls/FirstPersonControls.js"*/).then((DC) => {

over.context = over.getContext("2d")

const scene = new THREE.Scene();
//physics.addScene(scene)
const loader3d = new GLTF.GLTFLoader();
function load3D(folder) {
	//alert('./models/'+folder+'/model.gltf')
	return new Promise((resolve,reject) => {
		loader3d.load('./models/'+folder+'/model.gltf', function (gltf) {
			scene.add(gltf.scene);
			resolve(gltf.scene)
		}, undefined, function(error) {
			alert(error.message);
		});
		reject
	})
}

async function Item(type,x,y,z) {
	const consts = items[type]
	let t = await load3D(consts.folder)
	t.position.set(x,y,z)
	t.scale.set(...consts.scale)
	t.itemType = type
	return t
}

scene.fog = new THREE.Fog(0xD3D371, 100, 200);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let player = {"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"size":{"x":1,"y":5,"z":1},"bob":{"time":0,"amt":0},"health":100,"energy":100,"enexp":100,"food":100,"water":100,"sprint":{"state":false,"toggle":false,"last":-500},"sneak":{"state":false,"toggle":false,"last":-500},"hands":[]}
camera.rotation.order = "YXZ"
let stick = [0,0]
let plocation = [Infinity,Infinity]
const dir = [[0,1],[1,0],[0,-1],[-1,0]]
const bar = [["health","#FF0000","#AA0000"],["energy","#FFFF00","#AAAA00"],["food","#BB8800","#554400"],["water","#0000FF","#0000AA"]]
const items = [{"folder":"Torch","scale":[0.05,0.05,0.05]}]

/*const floorPhys = new THREE.Object3D();
scene.add(floorPhys);
physics.addHeightfield(floorPhys,2,2,[
	-5,-5,-5,
	-5,-5,-5,
	-5,-5,-5
],{"x":300,"y":1,"z":300})*/

/*load3D("Torch").then((t) => {
	//alert(JSON.stringify(t))
	t.position.set(0,0,-10)
	t.scale.set(0.05,0.05,0.05)
	//physics.addMesh(t,5,0.05)
})*/
//Item(0,0,0,-10)

/*Item ids
	0 - Torch
*/

const map = {}
const genSize = 21
set(map,0,0,Array(4).fill(true).map(a => Math.random()<0.5))

let lights = []
const lightAm = 5
const lightSp = (lightAm-1)*15
for (let i=0;i<lightAm**2;i++) {
	const light2 = new THREE.SpotLight(0xFFFFFF, 0.5, 200, Math.PI/2, 0.5);
	light2.position.set(0, 5, 0);
	//light2.castShadow = false;
	const tar = new THREE.Object3D();
	tar.position.set(0,4,0)
	//light2.visible = true
	//light2.penumbra = 1
	scene.add(light2);
	scene.add(tar);
	light2.target = tar
	lights.push(light2)
	/*const spotLightHelper = new THREE.SpotLightHelper( light2, 0xff0000 );
	scene.add( spotLightHelper );
	light2.helper = spotLightHelper*/
}

//const greed = greedyMergeBest(map)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
console.log(renderer.domElement)
console.log(THREE)

const lookat = new THREE.Object3D();
lookat.position.set(10, 5, 0)
scene.add(lookat);

let loaders = []
let wallTexes = []
let geos = []
let wallMats = []
let walls = []

const loader = new THREE.TextureLoader();

const planes = new THREE.PlaneGeometry( 600, 600 );

planes.setAttribute(
	'uv2',
	new THREE.BufferAttribute(
		planes.attributes.uv.array,
		2
	)
);

const ceilTex = loader.load( './images/ceil.png' );
const ceilLightsOpacTex = loader.load( './images/ceilLightOpac.png' );
ceilTex.colorSpace = THREE.SRGBColorSpace;
ceilTex.wrapS = THREE.RepeatWrapping;
ceilTex.wrapT = THREE.RepeatWrapping;
ceilTex.repeat.set(20,20)
ceilLightsOpacTex.colorSpace = THREE.NoColorSpace;
ceilLightsOpacTex.wrapS = THREE.RepeatWrapping;
ceilLightsOpacTex.wrapT = THREE.RepeatWrapping;
ceilLightsOpacTex.repeat.set(20,20)
const ceilMat = new THREE.MeshLambertMaterial( { map: ceilTex, lightMap: ceilLightsOpacTex } );
/*const ceilLightsTex = loader.load( './images/ceilLight.png' );
const ceilLightsOpacTex = loader.load( './images/ceilLightOpac.png' );
ceilLightsTex.colorSpace = THREE.SRGBColorSpace;
ceilLightsTex.wrapS = THREE.RepeatWrapping;
ceilLightsTex.wrapT = THREE.RepeatWrapping;
ceilLightsTex.repeat.set(20,20)
ceilLightsTex.alphaMap = ceilLightsOpacTex
const ceilLightsMat = new THREE.MeshBasicMaterial( { map: ceilLightsTex } );*/
const floorTex = loader.load( './images/floor.WEBP' );
floorTex.colorSpace = THREE.SRGBColorSpace;
floorTex.wrapS = THREE.MirroredRepeatWrapping;
floorTex.wrapT = THREE.MirroredRepeatWrapping;
floorTex.repeat.set(120,120)
const floorMat = new THREE.MeshLambertMaterial( { map: floorTex } );
const ceil = new THREE.Mesh( planes, ceilMat )
//const ceilLights = new THREE.Mesh( planes, ceilLightsMat )
const floor = new THREE.Mesh( planes, floorMat )
scene.add(ceil)
//scene.add(ceilLights)
scene.add(floor)

const wallTexLong = loader.load( './images/wall.WEBP' );
const wallTexSpec = loader.load( './images/wallSpec.png' );
wallTexLong.colorSpace = THREE.SRGBColorSpace;
wallTexLong.specularMap = wallTexSpec
const geometryLong = new THREE.BoxGeometry( 12, 10, 2 );
wallTexLong.wrapS = THREE.RepeatWrapping;
const wallTexShort = wallTexLong.clone()
const wallMatLong = new THREE.MeshLambertMaterial( { map: wallTexLong } );
const wallMatShort = new THREE.MeshLambertMaterial( { map: wallTexShort } );
wallTexShort.repeat.set(0.2,1)
wallTexLong.repeat.set(1.2,1)
//wallMatCube.reflectivity = 0.1
const roofMatCube = new THREE.MeshLambertMaterial( { color: 0xD3D371 } );
let materialsCube = [wallMatShort,wallMatShort,roofMatCube,roofMatCube,wallMatLong,wallMatLong]
let cubes = []

function wall(x,y,w,h) {
	const loaderw = new THREE.TextureLoader();
	loaders.push(loaderw)
	const wallTex1 = loaderw.load( './images/wall.WEBP' );
	wallTex1.colorSpace = THREE.SRGBColorSpace;
	const wallTex2 = loaderw.load( './images/wall.WEBP' );
	wallTexes.push([wallTex1,wallTex2])
	wallTex2.colorSpace = THREE.SRGBColorSpace;
	wallTex1.wrapS = THREE.RepeatWrapping;
	wallTex1.wrapT = THREE.RepeatWrapping;
	wallTex2.wrapS = THREE.RepeatWrapping;
	wallTex2.wrapT = THREE.RepeatWrapping;
	wallTex1.repeat.set(h,1)
	wallTex2.repeat.set(w,1)
	const geometry = new THREE.BoxGeometry( w*10, 10, h*10 );
	geos.push(geometry)
	const wallMat1 = new THREE.MeshLambertMaterial( { map: wallTex1 } );
	const wallMat2 = new THREE.MeshLambertMaterial( { map: wallTex2 } );
	const wallMat3 = new THREE.MeshLambertMaterial( { color: 0xD3D371 } );
	wallMats.push([wallMat1,wallMat2,wallMat3])
	let materials = [wallMat1,wallMat1,wallMat3,wallMat3,wallMat2,wallMat2]
	const wall = new THREE.Mesh( geometry, materials );
	walls.push(wall)
	wall.position.set(x*10+w*5,0,y*10+h*5)
	scene.add( wall );
	wall.size = {"x":w*10,"y":10,"z":h*10}
	return wall
}

function collides(bb1,bb2) {
	return (Math.abs(bb1.position.x-bb2.position.x) <= (bb1.size.x+bb2.size.x)/2 && Math.abs(bb1.position.y-bb2.position.y) <= (bb1.size.y+bb2.size.y)/2 && Math.abs(bb1.position.z-bb2.position.z) <= (bb1.size.z+bb2.size.z)/2)
}

/*const loaderr = new THREE.TextureLoader();

const materialls = [
  new THREE.MeshBasicMaterial({map: loadColorTexture('./images/pixil-frame-0 (0).jpg')}),
  new THREE.MeshBasicMaterial({map: loadColorTexture('./images/pixil-frame-0 (1).jpg')}),
  new THREE.MeshBasicMaterial({map: loadColorTexture('./images/pixil-frame-0 (2).jpg')}),
  new THREE.MeshBasicMaterial({map: loadColorTexture('./images/pixil-frame-0 (3).jpg')}),
  new THREE.MeshBasicMaterial({map: loadColorTexture('./images/pixil-frame-0 (4).jpg')}),
  new THREE.MeshBasicMaterial({map: loadColorTexture('./images/pixil-frame-0 (5).jpg')}),
];
const geometryy = new THREE.BoxGeometry( 5, 5, 5 );
const cubee = new THREE.Mesh(geometryy, materialls);
cubee.position.y = 20
scene.add(cubee)
 
function loadColorTexture( path ) {
  const texturee = loader.load( path );
  texturee.colorSpace = THREE.SRGBColorSpace;
  return texturee;
}*/

/*greed.rectangles.forEach((e,ee) => {
	const wal = wall(e.x,e.y,e.w,e.h)
	const mat = new THREE.MeshBasicMaterial( { color: 0x000000 } )
	const edges = new THREE.EdgesGeometry( wal.geometry );
	const line = new THREE.LineSegments( edges, mat );
	line.position.set(wal.position.x,wal.position.y,wal.position.z)
	scene.add( line );
})*/
function collAll() {
	return cubes.find(c => collides(c,player))
}

const light = new THREE.SpotLight(0xffffff, 0.5);
light.position.set(5, 5, 5);
scene.add(light);
light.target = lookat
light.penumbra/*phantasm*/ = 1
light.angle = Math.PI/10
light.distance = 100
//light.visible = false
//light.decay = 1000
/*const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );*/

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

//const controls = new OC.OrbitControls(camera, renderer.domElement);
//const controls = new FPC.FirstPersonControls(camera, renderer.domElement);
//const controls = new DC.DragControls(camera, renderer.domElement);

//camera.position.x = 10

camera.lookAt(25,0,25)
camera.position.set(0,0,0)

let m = {}
let k = {}
function key(e) {
	k[e.key] = e.type == "keydown"
	if (e.type == "keyup") {
		if (e.key == "w" || e.key == "s") stick[1] = 0
		if (e.key == "a" || e.key == "d") stick[0] = 0
	}
	/*if (e.key.toLowerCase().includes("shift")) {
		
	}*/
}
addEventListener("keydown",key)
addEventListener("keyup",key)

addEventListener("pointerlockchange", () => {
    console.log("Pointer lock:", document.pointerLockElement);
});

renderer.domElement.addEventListener("click", async () => {
	console.log("click detected. Attempting pointer lock")
  if(!document.pointerLockElement) {
    try {
      await renderer.domElement.requestPointerLock({
        unadjustedMovement: true,
      });
    } catch (error) {
      if (error.name === "NotSupportedError") {
        // Some platforms may not support unadjusted movement.
        await renderer.domElement.requestPointerLock();
      } else {
        throw error;
      }
    }
  }
});

addEventListener("pointerdown",function(e) {
	//camera.position.set(e.offsetX/100,0,e.offsetY/100)
	//renderer.domElement.requestPointerLock();
	let loc = [e.offsetX/over.offsetWidth*over.width,e.offsetY/over.offsetHeight*over.height]
	if (e.pointerType == "touch") {
		if (Math.hypot(loc[0]-150,loc[1]-850) <= 150) {
			stick = [loc[0]-150,loc[1]-850]
			e.stick = true
		} else if (Math.abs(over.width-150-loc[0]) <= 125 && Math.abs(900-loc[1]) <= 50) {
			if (e.timeStamp-player.sprint.last <= 500) {
				player.sprint.toggle = !player.sprint.toggle
			}// else {
				if (player.sprint.toggle) {
					player.sprint.state = !player.sprint.state
				} else {
					player.sprint.state = true
					e.sprint = true
				}
			//}
			player.sprint.last = e.timeStamp
		} else if (Math.abs(over.width-150-loc[0]) <= 125 && Math.abs(800-loc[1]) <= 50) {
			if (e.timeStamp-player.sneak.last <= 500) {
				player.sneak.toggle = !player.sneak.toggle
			}// else {
				if (player.sneak.toggle) {
					player.sneak.state = !player.sneak.state
				} else {
					player.sneak.state = true
					e.sneak = true
				}
			//}
			player.sneak.last = e.timeStamp
		}
	}
	
	m[e.pointerId] = e
})
addEventListener("pointermove",function(e) {
	//debug.innerHTML = ((m.offsetX/renderer.domElement.offsetWidth)-(e.offsetX/renderer.domElement.offsetWidth))+JSON.stringify(camera.rotation)
	const pre = m[e.pointerId]
	if (pre) {
		let loc = [e.offsetX/over.offsetWidth*over.width,e.offsetY/over.offsetHeight*over.height]
		if (/*e.pointerType == "touch" && (Math.hypot(loc[0]-150,loc[1]-850) <= 150)*/pre.stick) {
			e.stick = true
			stick = [loc[0]-150,loc[1]-850]
			const amp = Math.hypot(...stick)
			if (amp > 150) stick = [stick[0]/amp*150,stick[1]/amp*150]
		} else if (pre.sprint) {
			e.sprint = true
		} else if (pre.sneak) {
			e.sneak = true
		} else {
			const hrot = ((pre.offsetX/renderer.domElement.offsetWidth)-(e.offsetX/renderer.domElement.offsetWidth))*Math.PI*10
			player.rotation.y += hrot
			player.rotation.z += hrot
			const vrot = ((pre.offsetY/renderer.domElement.offsetHeight)-(e.offsetY/renderer.domElement.offsetHeight))*Math.PI*2.5
			player.rotation.x = Math.min(Math.max(vrot+player.rotation.x,-Math.PI/2),Math.PI/2)
			/*camera.rotation.x += Math.cos(camera.rotation.y)*vrot
			camera.rotation.z += Math.sin(camera.rotation.y)*vrot*/
		}
	}
	m[e.pointerId] = e
})

//camera.position.y = 100

function set(obj,x,y,val) {
	if (!obj[x]) {
		obj[x] = {}
	}
	obj[x][y] = val
}
function get(obj,x,y) {
	return (obj[x] ?? {})[y]
}

addEventListener("pointerup",function(e) {
	if (m[e.pointerId].stick) stick = [0,0]
	if (m[e.pointerId].sprint && !player.sprint.toggle) player.sprint.state = false
	if (m[e.pointerId].sneak && !player.sneak.toggle) player.sneak.state = false
	m[e.pointerId] = e
})

floor.rotation.set(Math.PI*1.5,0,0)
ceil.rotation.set(Math.PI*0.5,0,0)
//ceilLights.rotation.set(Math.PI*0.5,0,0)

function animate( time ) {
	//debug.innerHTML = time

  //cube.rotation.x = time / 2000;
  //cube.rotation.y = time / 1000;}
	/*ceil.rotation.set(time/1000,0,0)
	debug.innerHTML = time/1000*/
	
	light.visible = player.hands.includes(0)
	
	if (k["w"]) stick[1]=-150
	if (k["a"]) stick[0]=-150
	if (k["s"]) stick[1]=150
	if (k["d"]) stick[0]=150
	if (k["Shift"] != undefined) player.sprint.state = k["Shift"]
	if (k["Control"] != undefined) player.sneak.state = k["Control"]
	
	player.food -= 0.0004
	player.water -= 0.0025
	const samp = Math.hypot(...stick)
	if (samp > player.enexp/2 && player.sneak.state) {
		stick[0] = stick[0]/samp*player.enexp/2
		stick[1] = stick[1]/samp*player.enexp/2
		player.energy = Math.min(player.energy+0.12*player.enexp/100,player.enexp)
	} else if (samp > player.enexp) {
		if (player.energy > 0 && player.sprint.state) {
			player.energy -= 0.16
			player.enexp -= 0.04
		} else {
			stick[0] = stick[0]/samp*player.enexp
			stick[1] = stick[1]/samp*player.enexp
		}
	} else if (samp == 0) {
		player.energy = Math.min(player.energy+0.24*player.enexp/100,player.enexp)
		player.enexp = Math.min(player.enexp+0.00025*player.enexp*(player.energy == player.enexp ? 1.1 : 1),100)
		if (player.energy < player.enexp || player.enexp < 100) {
			player.food -= 0.0008
			player.water -= 0.005
		}
	} else {
		if (samp <= player.enexp/2) {
			player.energy = Math.min(player.energy+0.12*player.enexp/100,player.enexp)
			if (player.energy < player.enexp || player.enexp < 100) {
				player.food -= 0.0008
				player.water -= 0.005
			}
		}
	}
	stick[0] /= 1.5
	stick[1] /= 1.5
	
	over.style.width = renderer.domElement.offsetWidth+"px"
	over.width = 1000*renderer.domElement.width/renderer.domElement.height
	over.style.height = Math.floor(renderer.domElement.offsetHeight)+"px"
	//camera.position.x += stick[0]/150*Math.sin(camera.rotation.y)+stick[1]/150*Math.cos(camera.rotation.y)
	//camera.position.z += stick[0]/150*Math.cos(camera.rotation.y)+stick[1]/150*Math.sin(camera.rotation.y)
	let Sspeed = [0,0]
	player.position.z += stick[0]/150 * Math.sin(-player.rotation.y)+stick[1]/150 * Math.cos(-player.rotation.y);
	if (collAll()) player.position.z -= stick[0]/150 * Math.sin(-player.rotation.y)+stick[1]/150 * Math.cos(-player.rotation.y);
	else Sspeed[0] = stick[0]/150 * Math.sin(-player.rotation.y)+stick[1]/150 * Math.cos(-player.rotation.y);
	player.position.x += stick[0]/150 * Math.cos(-player.rotation.y)-stick[1]/150 * Math.sin(-player.rotation.y);
	if (collAll()) player.position.x -= stick[0]/150 * Math.cos(-player.rotation.y)-stick[1]/150 * Math.sin(-player.rotation.y);
	else Sspeed[1] = stick[0]/150 * Math.cos(-player.rotation.y)-stick[1]/150 * Math.sin(-player.rotation.y);
	
	player.rotation.z += -stick[0]/600
	player.rotation.z /= 2
	
	lights.forEach((e,ee) => {
		const pos = [30*Math.floor(player.position.x/30)+(ee%lightAm)*30-lightSp,30*Math.floor(player.position.z/30)+30*Math.floor(ee/lightAm)-lightSp]
		e.position.set(pos[0], 6, pos[1]);
		e.target.position.set(pos[0], 4, pos[1]);
		//e.helper.update()
	})
	//ceilLights.position.set(30*Math.floor(camera.position.x/30)+15,4.9,30*Math.floor(camera.position.z/30)+15)
	floor.position.set(30*Math.floor(player.position.x/30)-5,-5,30*Math.floor(player.position.z/30)-5)
	//floorPhys.position.set(30*Math.floor(player.position.x/30)-5,-5,30*Math.floor(player.position.z/30)-5)
	ceil.position.set(30*Math.floor(player.position.x/30)+15,4.9,30*Math.floor(player.position.z/30)+15)
	
	/*camera.position.x += stick[1]/150
	camera.position.z += stick[0]/150*/
	light.position.set(player.position.x,player.position.y+player.bob.amt/2,player.position.z)
	const off = new THREE.Vector3()
	camera.getWorldDirection(off)
	lookat.position.set(player.position.x+off.x,player.position.y+off.y+player.bob.amt/2,player.position.z+off.z)
	if (Math.floor(player.position.x/10) != plocation[0] || Math.floor(player.position.z/10) != plocation[1]) {
		plocation = [Math.floor(player.position.x/10),Math.floor(player.position.z/10)]
		//debug.innerHTML = JSON.stringify(plocation)
		let genA = {}
		let proc = []
		let nWall = []
		//debug.innerHTML += " "+(plocation[0]-(genSize-1)/2)+","+(plocation[0]+(genSize-1)/2)+","+(plocation[1]-(genSize-1)/2)+","+(plocation[1]+(genSize-1)/2)
		for (let i=plocation[0]-(genSize-1)/2;i<=plocation[0]+(genSize-1)/2;i++) {
			for (let j=plocation[1]-(genSize-1)/2;j<=plocation[1]+(genSize-1)/2;j++) {
				set(genA,i,j,get(map,i,j))
				if (get(map,i,j) != undefined) proc.push([i,j])
			}
		}
		while (proc.length > 0) {
			let nexupd = [...proc]
			proc.forEach((e) => {
				let av = []
				const loc = genA[e[0]][e[1]]
				dir.forEach((r,rr) => {
					if (Math.abs(plocation[0]-e[0]-r[0]) <= (genSize-1)/2 && Math.abs(plocation[1]-e[1]-r[1]) <= (genSize-1)/2 && !get(genA,e[0]+r[0],e[1]+r[1]) && !loc[rr]) av.push(rr)
				})
				if (av.length == 0) nexupd.splice(nexupd.indexOf(e),1)
			})
			proc = nexupd
			if (proc.length != 0) {
				const ind = Math.floor(Math.random()*proc.length)
				const sel = proc[ind]
				let av = []
				const loc = genA[sel[0]][sel[1]]
				dir.forEach((r,rr) => {
					if (Math.abs(plocation[0]-(sel[0]+r[0])) <= (genSize-1)/2 && Math.abs(plocation[1]-(sel[1]+r[1])) <= (genSize-1)/2 && !get(genA,sel[0]+r[0],sel[1]+r[1]) && !loc[rr]) av.push(rr)
				})
				const ind2 = Math.floor(Math.random()*av.length)
				genA[sel[0]][sel[1]][av[ind2]] = true
				nWall.push([sel[0],sel[1],av[ind2]])
				let selld2 = (get(genA,sel[0]+dir[av[ind2]][0],sel[1]+dir[av[ind2]][1]) ?? Array(4).fill(false))
				selld2[(2+av[ind2])%4] = true
				set(genA,sel[0]+dir[av[ind2]][0],sel[1]+dir[av[ind2]][1],selld2)
				if (!proc.some(u => u[0] == sel[0]+dir[av[ind2]][0] && u[1] == sel[1]+dir[av[ind2]][1])) proc.push([sel[0]+dir[av[ind2]][0],sel[1]+dir[av[ind2]][1]])
			}
		}
		/*while (walls.length > 0) {
			walls.pop().remove()
			wallMats.pop().forEach((e) => {
				e.dispose()
			})
			geos.pop().dispose()
			wallTexes.pop().forEach((e) => {
				e.dispose()
			})
		}*/
		//let normed = []
		let locs = []
		for (const [key,value] of Object.entries(genA)) {
			for (const [key2,value2] of Object.entries(value)) {
				if ((value2 ?? []).includes(false)) locs.push([key,key2])
			}
		}
		for (let i=0;i<nWall.length/4;i++) {
			const locind = Math.floor(Math.random()*nWall.length)
			const cWall = nWall[locind]
			const cLoc = [cWall[0],cWall[1]]
			let p = get(genA,...cLoc)
			p[cWall[2]] = true
			set(genA,cLoc,p)
			let p2 = get(genA,cWall[0]+dir[cWall[2]][0],cWall[1]+dir[cWall[2]][1])
			p2[(cWall[2]+2)%4] = true
			set(genA,cWall[0]+dir[cWall[2]][0],cWall[1]+dir[cWall[2]][1],p2)
			nWall.splice(locind,1)
		}
		
		while (cubes.length > 0) {
			scene.remove(cubes.pop())//.remove()
		}
		//alert(JSON.stringify(Object.values(genA).filter(g => Object.values(g).some(g2 => !g2))))
		for (const [key,value] of Object.entries(genA)) {
			//normed.push([])
			for (const [key2,value2] of Object.entries(value)) {
				set(map,key,key2,value2)
				if (value2) {
					dir.forEach((e,ee) => {
						if (!value2[ee]) {
							const wall = new THREE.Mesh( geometryLong, materialsCube );
							wall.position.set(key*10+e[0]*5,0,key2*10+e[1]*5)
							wall.rotation.set(0,ee%2 ? Math.PI/2 : 0,0)
							scene.add( wall );
							wall.size = {"x":ee%2 ? 2 : 12,"y":10,"z":ee%2 ? 12 : 2}
							cubes.push(wall)
						}
					})
				}
				//normed.at(-1).push(+(value2 ?? 0))
			}
		}
		//const newgreed = greedyMergeBest(normed)
		//if (confirm("do you consent?\n"+newgreed.rectangles.length)) {
		//newgreed.rectangles.forEach((e,ee) => {
			/*const wal = wall(e.x,e.y,e.w,e.h)
			const mat = new THREE.MeshBasicMaterial( { color: 0x000000 } )
			const edges = new THREE.EdgesGeometry( wal.geometry );
			const line = new THREE.LineSegments( edges, mat );
			line.position.set(wal.position.x,wal.position.y,wal.position.z)
			scene.add( line );*/
		//})
		//}
		/*const cube = new THREE.Mesh( geometryCube, materialsCube );
		cube.position.set(x*10+w*5,0,y*10+h*5)
		scene.add( cube );
		cube.size = [w*10,10,h*10]
		cube.collides = function (bb) {
			return Math.abs(bb.position.x-this.position.x) <= bb.size.x+this.size.x && Math.abs(bb.position.y-this.position.y) <= bb.size.y+this.size.y && Math.abs(bb.position.z-this.position.z) <= bb.size.z+this.size.z
		}*/
	}
	const speed = Math.hypot(...Sspeed)
	if (speed == 0) {
		player.bob.time = 0
		player.bob.last = time
	} else {
		player.bob.time += (time-player.bob.last)*speed
		player.bob.last = time
	}
	player.bob.amt = Math.cos(player.bob.time/Math.PI/10)/3
	camera.position.set(player.position.x,player.position.y+player.bob.amt,player.position.z)
	camera.rotation.set(player.rotation.x,player.rotation.y,player.rotation.z)
	renderer.render( scene, camera );
	/*const colled = (collAll() ?? {})
	debug.innerHTML = (JSON.stringify(colled.size))+(JSON.stringify(colled.position))*/
	/*over.context.fillStyle = "#FF0000"
	for (const [key,value] of Object.entries(map)) {
		for (const [key2,value2] of Object.entries(value)) {
			if (value2) {
				over.context.fillRect(key+100,key2+100,1,1)
			}
		}
	}*/
	stick[0] *= 1.5
	stick[1] *= 1.5
	if (Object.values(m).some(p => p.pointerType == "touch") || Object.values(m).length == 0) {
		over.context.strokeStyle = "#AAAAAAAA"
		over.context.fillStyle = "#AAAAAAAA"
		over.context.lineWidth = 4
		over.context.beginPath();
		over.context.arc(150, 850, 150, 0, 2 * Math.PI);
		over.context.stroke();
		over.context.beginPath();
		over.context.arc(150+stick[0], 850+stick[1], 25, 0, 2 * Math.PI);
		over.context.fill();
		
		over.context.strokeStyle = player.sprint.state ? "#AA7777DD" : "#DDAAAAAA"
		over.context.beginPath();
		over.context.arc(150, 850, player.enexp, 0, 2 * Math.PI);
		over.context.stroke();
		
		over.context.strokeStyle = player.sneak.state ? "#7777AADD" : "#AAAADDAA"
		over.context.beginPath();
		over.context.arc(150, 850, player.enexp/2, 0, 2 * Math.PI);
		over.context.stroke();
		
		over.context.fillStyle = player.sprint.state ? "#AA7777DD" : "#DDAAAAAA"
		over.context.fillRect(over.width-275,850,250,100)
		over.context.font = "95px Arial"
		over.context.fillStyle = "#000000"
		over.context.textBaseline = "bottom"
		over.context.textAlign = "center"
		over.context.fillText("Sprint",over.width-150,950)
		
		over.context.fillStyle = player.sneak.state ? "#7777AADD" : "#AAAADDAA"
		over.context.fillRect(over.width-275,750,250,100)
		over.context.font = "90px Arial"
		over.context.fillStyle = "#000000"
		over.context.fillText("Sneak",over.width-150,850)
	}
	over.context.lineWidth = 2
	bar.forEach((e,i) => {
		over.context.strokeStyle = "#000000"
		over.context.fillStyle = e[2]
		over.context.beginPath()
		over.context.moveTo(0,i*40+30)
		over.context.lineTo(30,i*40+10)
		over.context.lineTo(330,i*40+10)
		over.context.lineTo(300,i*40+30)
		over.context.closePath()
		over.context.stroke()
		over.context.fill()
		
		over.context.fillStyle = e[1]
		over.context.beginPath()
		over.context.moveTo(0,i*40+30)
		over.context.lineTo(30,i*40+10)
		over.context.lineTo(30+(3*player[e[0]]),i*40+10)
		over.context.lineTo((3*player[e[0]]),i*40+30)
		over.context.closePath()
		over.context.fill()
	})
	if (player.enexp < 100) {
		over.context.strokeStyle = "#FF0000"
		over.context.beginPath()
		over.context.moveTo(3*player.enexp,70)
		over.context.lineTo(30+3*player.enexp,50)
		over.context.stroke()
	}
}
})
.catch((err) => {
	alert(err.message)
})
}).catch((err) => {
	alert(err.message)
})
/*})
})*/
