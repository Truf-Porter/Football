import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8dc8f0);
scene.fog = new THREE.Fog(0x8dc8f0, 90, 220);
const camera = new THREE.PerspectiveCamera(58, innerWidth/innerHeight, .1, 500);
const renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
renderer.domElement.id='game'; renderer.setSize(innerWidth,innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xe7f7ff,0x32603a,2.1));
const sun=new THREE.DirectionalLight(0xfff1d5,3.0); sun.position.set(-35,65,28); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-75;sun.shadow.camera.right=75;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;scene.add(sun);

const mat=(color,roughness=.78,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const grassMats=[mat(0x287c3d),mat(0x318947),mat(0x27763a)];
const white=mat(0xf2f4ed), dark=mat(0x18232a), ballMat=mat(0xf8f7ed,.32), black=mat(0x111820);
const homeColor=0x20b9ff, awayColor=0xf23e65;
const homeKit=mat(homeColor,.55), awayKit=mat(awayColor,.55), skinMats=[mat(0x9b603e),mat(0xc98b61),mat(0x71432e),mat(0xe0ae83)];
const ground=new THREE.Mesh(new THREE.PlaneGeometry(300,300),mat(0x1c482d));ground.rotation.x=-Math.PI/2;ground.position.y=-.16;ground.receiveShadow=true;scene.add(ground);

const field=new THREE.Group();scene.add(field);
const pitchW=70,pitchL=112;
for(let i=0;i<14;i++){const stripe=new THREE.Mesh(new THREE.PlaneGeometry(pitchW,pitchL/14),grassMats[i%2]);stripe.rotation.x=-Math.PI/2;stripe.position.set(0,-.12,(i-6.5)*pitchL/14);stripe.receiveShadow=true;field.add(stripe);}
function line(x1,z1,x2,z2,y=.015){const dx=x2-x1,dz=z2-z1;const o=new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(dx,dz),.035,.12),white);o.position.set((x1+x2)/2,y,(z1+z2)/2);o.rotation.y=-Math.atan2(dz,dx);field.add(o);}
line(-35,-56,35,-56);line(-35,56,35,56);line(-35,-56,-35,56);line(35,-56,35,56);line(-35,0,35,0);
const circle=new THREE.Mesh(new THREE.RingGeometry(9.05,9.18,64),white);circle.rotation.x=-Math.PI/2;circle.position.y=.02;field.add(circle);
const spotM=mat(0xffffff);function spot(x,z){const s=new THREE.Mesh(new THREE.CircleGeometry(.22,16),spotM);s.rotation.x=-Math.PI/2;s.position.set(x,.03,z);field.add(s)}spot(0,0);spot(0,-44);spot(0,44);
for(const z of [-56,56]){const box=new THREE.Mesh(new THREE.PlaneGeometry(44,18),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0}));box.rotation.x=-Math.PI/2;box.position.set(0,.005,z+(z<0?9:-9));field.add(box);line(-20,z<0?-56:56,20,z<0?-56:56);line(-20,z<0?-56:-38, -20,z<0?-38:56);line(20,z<0?-56:-38,20,z<0?-38:56);line(-20,z<0?-38:38,20,z<0?-38:38);}
function makeGoal(z){const g=new THREE.Group();const frame=mat(0xf4f6f0,.35,.2);for(const x of [-5.5,5.5]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,4.5,10),frame);p.position.set(x,2.25,z);g.add(p)}const bar=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,11,10),frame);bar.rotation.z=Math.PI/2;bar.position.set(0,4.5,z);g.add(bar);for(let i=0;i<=10;i++){const net=new THREE.Mesh(new THREE.BoxGeometry(.035,4.4,.035),mat(0xdce9e7));net.position.set(-5.4+i*1.08,2.2,z+(z<0?-2.2:2.2));g.add(net)}for(let i=0;i<5;i++){const n=new THREE.Mesh(new THREE.BoxGeometry(11,.035,.035),mat(0xdce9e7));n.position.set(0,.4+i*.9,z+(z<0?-2.2:2.2));g.add(n)}scene.add(g)}
makeGoal(-57);makeGoal(57);

// Simple generated stadium bowl, stands, crowd dots and floodlight towers.
const standMat=mat(0x253a55), stand2=mat(0x3d536d);
for(const side of [-1,1]){
 const stand=new THREE.Mesh(new THREE.BoxGeometry(8,13,132),standMat);stand.position.set(side*43,6.5,0);scene.add(stand);
 for(let row=0;row<8;row++){const tier=new THREE.Mesh(new THREE.BoxGeometry(8,.55,130),stand2);tier.position.set(side*(39+row*.9),row*1.25+2,-1);scene.add(tier)}
 for(let i=0;i<1000;i++){const x=side*(39+Math.random()*6.8),y=1+Math.random()*11,z=-64+Math.random()*128;const dot=new THREE.Mesh(new THREE.BoxGeometry(.22,.3,.22),mat([0xf4d6a0,0xe8f1ff,0x334e8d,0xd74c53,0x202b37,0x66b78a][Math.floor(Math.random()*6)]));dot.position.set(x,y,z);scene.add(dot)}
}
for(const z of [-1,1]){const stand=new THREE.Mesh(new THREE.BoxGeometry(78,12,7),standMat);stand.position.set(0,6,z*62);scene.add(stand);for(let i=0;i<250;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(.22,.28,.22),mat([0xf4d6a0,0xe8f1ff,0x334e8d,0xd74c53][Math.floor(Math.random()*4)]));d.position.set(-38+Math.random()*76,1+Math.random()*10,z*(58+Math.random()*6));scene.add(d)}}
for(const x of [-48,48])for(const z of [-55,0,55]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.18,.3,22,8),dark);pole.position.set(x,11,z);scene.add(pole);const lamp=new THREE.Mesh(new THREE.BoxGeometry(3,.8,.5),mat(0xffffff,.2));lamp.position.set(x,22,z);scene.add(lamp);const light=new THREE.PointLight(0xd9efff,55,45);light.position.set(x,21,z);scene.add(light)}

function makePlayer(team,index,x,z){
 const root=new THREE.Group();root.position.set(x,0,z);scene.add(root);
 const kit=team===0?homeKit:awayKit,skin=skinMats[index%skinMats.length];
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,.75,4,8),kit);body.position.y=1.55;body.castShadow=true;root.add(body);
 const shorts=new THREE.Mesh(new THREE.BoxGeometry(.8,.38,.55),team===0?mat(0x142d43):mat(0x191e34));shorts.position.y=.91;root.add(shorts);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.32,16,12),skin);head.position.y=2.45;head.castShadow=true;root.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.33,12,8,0,Math.PI*2,0,Math.PI*.48),mat(index%3===0?0x19130f:0x34231a));hair.position.y=2.57;root.add(hair);
 for(const s of [-1,1]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.16,.58,3,6),team===0?white:mat(0x222b4a));leg.position.set(s*.23,.42,0);leg.castShadow=true;root.add(leg);const shoe=new THREE.Mesh(new THREE.BoxGeometry(.24,.13,.38),mat(0xf8f8f0));shoe.position.set(s*.23,.12,-.08);root.add(shoe)}
 const number=new THREE.Mesh(new THREE.BoxGeometry(.34,.35,.025),white);number.position.set(0,1.62,.555);root.add(number);
 return {root,team,index,vx:0,vz:0,stamina:100,number:index+1};
}
const players=[];
for(let i=0;i<11;i++){
 const x=(i%4-1.5)*10,z=-38+Math.floor(i/4)*15;
 players.push(makePlayer(0,i,x,z));
}
for(let i=0;i<11;i++){
 const x=(i%4-1.5)*10,z=38-Math.floor(i/4)*15;
 players.push(makePlayer(1,i,x,z));
}
const ball=new THREE.Mesh(new THREE.SphereGeometry(.43,24,18),ballMat);ball.castShadow=true;ball.position.set(0,.45,0);scene.add(ball);
const seams=new THREE.Group();ball.add(seams);
for(let i=0;i<5;i++){const patch=new THREE.Mesh(new THREE.CircleGeometry(.13,5),black);patch.position.set(Math.cos(i*1.256)*.28,Math.sin(i*1.256)*.28,.31);seams.add(patch)}
const shadow=new THREE.Mesh(new THREE.CircleGeometry(.65,24),new THREE.MeshBasicMaterial({color:0x06170b,transparent:true,opacity:.3}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.01;scene.add(shadow);

let controlled=players[7], possession=null, ballV=new THREE.Vector3(), gameTime=0, paused=false, cameraMode=0, homeScore=0,awayScore=0,toastTimer=0;
const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Escape')togglePause();if(e.code==='KeyC')cameraMode=(cameraMode+1)%2;if(e.code==='KeyQ')switchPlayer();if(e.code==='KeyJ')passBall();if(e.code==='KeyK'||e.code==='Space')shootBall();if(e.code==='KeyL')tackle();});
addEventListener('keyup',e=>keys[e.code]=false);
function switchPlayer(){const candidates=players.filter(p=>p.team===0);candidates.sort((a,b)=>dist(a.root.position,ball.position)-dist(b.root.position,ball.position));controlled=candidates[0];showToast('PLAYER SWITCH');}
function dist(a,b){return Math.hypot(a.x-b.x,a.z-b.z)}
function showToast(t){const el=document.getElementById('toast');el.textContent=t;el.style.opacity=1;toastTimer=1.3}
function passBall(){if(possession!==controlled&&dist(controlled.root.position,ball.position)>2.2)return;let target=players.filter(p=>p.team===0&&p!==controlled).sort((a,b)=>dist(a.root.position,controlled.root.position)-dist(b.root.position,controlled.root.position))[0];const dir=new THREE.Vector3(target.root.position.x-ball.position.x,0,target.root.position.z-ball.position.z).normalize();ballV.copy(dir.multiplyScalar(17));ballV.y=2.5;possession=null;showToast('PASS')}
function shootBall(){if(possession!==controlled&&dist(controlled.root.position,ball.position)>2.2)return;const dir=new THREE.Vector3(-ball.position.x,0,controlled.team===0?-1:1);dir.z=controlled.team===0?-1:1;dir.x*=.4;dir.normalize();ballV.copy(dir.multiplyScalar(29));ballV.y=5.5;possession=null;showToast('SHOT!')}
function tackle(){for(const p of players){if(p.team!==controlled.team&&dist(p.root.position,controlled.root.position)<2.1){ballV.set((controlled.root.position.x-p.root.position.x)*5,2,(controlled.root.position.z-p.root.position.z)*5);possession=controlled;showToast('TACKLE!');return}}}
function togglePause(){paused=!paused;document.getElementById('pause').classList.toggle('hidden',!paused)}
document.getElementById('resume').onclick=togglePause;document.getElementById('restart').onclick=()=>{homeScore=awayScore=0;resetKickoff();paused=false;document.getElementById('pause').classList.add('hidden');updateScore()};
function resetKickoff(){ball.position.set(0,.45,0);ballV.set(0,0,0);possession=null;players.forEach((p,i)=>{p.root.position.set((i%4-1.5)*10,(0),p.team===0?-38+Math.floor((i%11)/4)*15:38-Math.floor((i%11)/4)*15);p.vx=p.vz=0});controlled=players[7]}
function updateScore(){document.getElementById('homeScore').textContent=homeScore;document.getElementById('awayScore').textContent=awayScore}
document.querySelectorAll('[data-key]').forEach(b=>{const code=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[code]=true;b.setPointerCapture(e.pointerId)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>keys[code]=false))});
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();({pass:passBall,shoot:shootBall,tackle,switch:switchPlayer})[b.dataset.action]?.()}));
function moveToward(p,target,speed,dt){const dx=target.x-p.root.position.x,dz=target.z-p.root.position.z,l=Math.hypot(dx,dz)||1;p.vx+=(dx/l*speed-p.vx)*Math.min(1,dt*4);p.vz+=(dz/l*speed-p.vz)*Math.min(1,dt*4)}
function updatePlayers(dt){
 const forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),right=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
 const sprint=keys.ShiftLeft||keys.ShiftRight, speed=sprint&&controlled.stamina>0?10:6.3;
 if(sprint&&forward+right!==0)controlled.stamina=Math.max(0,controlled.stamina-18*dt);else controlled.stamina=Math.min(100,controlled.stamina+9*dt);
 controlled.vx+=(right*speed-controlled.vx)*Math.min(1,dt*8);controlled.vz+=(-forward*speed-controlled.vz)*Math.min(1,dt*8);
 for(const p of players){
  if(p!==controlled){
   if(p.team===1){if(possession&&possession.team===0)moveToward(p,ball.position,5.1,dt);else if(dist(p.root.position,ball.position)>2.2)moveToward(p,ball.position,4.5,dt);else if(p.index%3===0)moveToward(p,{x:0,z:ball.position.z+(p.team===0?8:-8)},3,dt)}
   else if(p!==possession&&dist(p.root.position,ball.position)>6){const homeZ=-38+Math.floor(p.index/4)*15;moveToward(p,{x:(p.index%4-1.5)*10,z:homeZ},2.4,dt)}
  }
  p.root.position.x+=p.vx*dt;p.root.position.z+=p.vz*dt;p.root.position.x=THREE.MathUtils.clamp(p.root.position.x,-33,33);p.root.position.z=THREE.MathUtils.clamp(p.root.position.z,-53,53);
  if(Math.hypot(p.vx,p.vz)>.5)p.root.rotation.y=Math.atan2(p.vx,p.vz);
  const moving=Math.hypot(p.vx,p.vz);p.root.children[1].rotation.x=Math.sin(gameTime*11+p.index)*Math.min(.25,moving*.025);
 }
}
function updateBall(dt){
 if(possession){const p=possession;const f=new THREE.Vector3(Math.sin(p.root.rotation.y),0,Math.cos(p.root.rotation.y));ball.position.x=p.root.position.x+f.x*.95;ball.position.z=p.root.position.z+f.z*.95;ball.position.y=.48+Math.abs(Math.sin(gameTime*9))*.09;ballV.multiplyScalar(.8);if(p===controlled&&(keys.KeyJ||keys.KeyK)){}}
 else {ball.position.x+=ballV.x*dt;ball.position.y+=ballV.y*dt;ball.position.z+=ballV.z*dt;ballV.y-=17*dt;if(ball.position.y<.43){ball.position.y=.43;ballV.y=Math.abs(ballV.y)*.45;if(Math.abs(ballV.y)<1)ballV.y=0}ballV.x*=Math.pow(.985,dt*60);ballV.z*=Math.pow(.985,dt*60);}
 ball.rotation.x+=ballV.z*dt*1.7;ball.rotation.z-=ballV.x*dt*1.7;
 ball.position.x=THREE.MathUtils.clamp(ball.position.x,-35.5,35.5);
 if(ball.position.z<-56.5||ball.position.z>56.5){
  const goal=Math.abs(ball.position.x)<5.5;
  if(goal){if(ball.position.z<0)homeScore++;else awayScore++;updateScore();showToast(ball.position.z<0?'GOAL! AZURE':'GOAL! CRIMSON');resetKickoff();}
  else {ball.position.z=Math.sign(ball.position.z)*55.5;ballV.z*=-.65}
 }
 if(ball.position.x<=-35.5||ball.position.x>=35.5){ballV.x*=-.65;ball.position.x=THREE.MathUtils.clamp(ball.position.x,-35.4,35.4)}
 for(const p of players){if(!possession&&dist(p.root.position,ball.position)<.95&&ball.position.y<1.35){possession=p;ballV.set(0,0,0);if(p.team===0)controlled=p;break}}
 if(possession&&possession.team===1&&dist(possession.root.position,controlled.root.position)<1.6&&Math.random()<.018){ballV.set((controlled.root.position.x-possession.root.position.x)*6,2,(controlled.root.position.z-possession.root.position.z)*6);possession=null}
 shadow.position.set(ball.position.x,.015,ball.position.z);
}
function drawMap(){const c=document.getElementById('map'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#27683b';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#c8ead2';ctx.lineWidth=1;ctx.strokeRect(3,3,c.width-6,c.height-6);ctx.beginPath();ctx.moveTo(c.width/2,3);ctx.lineTo(c.width/2,c.height-3);ctx.stroke();ctx.beginPath();ctx.arc(c.width/2,c.height/2,12,0,Math.PI*2);ctx.stroke();for(const p of players){ctx.fillStyle=p.team===0?'#38c7ff':'#ff5576';ctx.beginPath();ctx.arc((p.root.position.x+35)/70*c.width,(p.root.position.z+56)/112*c.height,2.8,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc((ball.position.x+35)/70*c.width,(ball.position.z+56)/112*c.height,2,0,Math.PI*2);ctx.fill()}
const clockEl=document.getElementById('clock');
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.035);if(!paused){gameTime+=dt;updatePlayers(dt);updateBall(dt);clockEl.textContent=String(Math.floor(gameTime/60)).padStart(2,'0')+':'+String(Math.floor(gameTime%60)).padStart(2,'0');if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)document.getElementById('toast').style.opacity=0}document.getElementById('playerTag').textContent=`${controlled.team===0?'AZURE':'CRIMSON'} · PLAYER ${controlled.number} · STAMINA ${Math.round(controlled.stamina)}%`;drawMap()}
 const target=controlled.root.position;const desired=cameraMode===0?new THREE.Vector3(target.x+0,target.y+8,target.z+13):new THREE.Vector3(0,75,0);if(cameraMode===0){desired.x-=Math.sin(controlled.root.rotation.y)*4;desired.z-=Math.cos(controlled.root.rotation.y)*4}camera.position.lerp(desired,.08);camera.lookAt(cameraMode===0?new THREE.Vector3(target.x,target.y+1,target.z-3):new THREE.Vector3(0,0,0));renderer.render(scene,camera)}
const clock=new THREE.Clock();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
document.getElementById('loading').style.display='none';
showToast('KICK OFF');
animate();