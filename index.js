const canvas=document.querySelector('canvas');
const c=canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const scoreLe=document.getElementById('score');
let projectils=[];
let enemies=[]
let particles=[]
let score=0;

class Player {
  constructor(x,y,radius,color){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color; 
  }

  drow(){
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
    c.fillStyle=this.color;
    c.fill()
  }
}

class Projectile{

  constructor(x,y,radius,color,velocity){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color; 
    this.velocity=velocity;
  }
  drow(){
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
    c.fillStyle=this.color;
    c.fill()
  }
updata (){
  this.x+=this.velocity.x;
  this.y+=this.velocity.y;
  this.drow();
}

}

class Enemy{

  constructor(x,y,radius,color,velocity){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color; 
    this.velocity=velocity;
  }
  drow(){
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
    c.fillStyle=this.color;
    c.fill()
  }
updata (){
  this.x+=this.velocity.x;
  this.y+=this.velocity.y;
  this.drow();
}

}

const friction=0.99;
class Particle{

  constructor(x,y,radius,color,velocity){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color; 
    this.velocity=velocity;
    this.alpha=1;
  }
  drow(){
    c.save()
    c.globalAlpha=this.alpha;
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
    c.fillStyle=this.color;
    c.fill()
    c.restore()
  }
updata (){
  this.drow();
  this.x+=this.velocity.x;
  this.y+=this.velocity.y;
  this.velocity.x*=friction;
  this.velocity.y*=friction;
  
  this.alpha-=0.01;
}

}

const x=canvas.width/2;
const y=canvas.height/2;
const player=new  Player(x,y,30,'white');
let creatEnmeId;

function spawnEnemies(){
  creatEnmeId=setInterval(()=>{
    const radius=Math.random()*(30-8)+8;
    let x,y;
    if(Math.random()<0.5){
      x=Math.random()<0.5?0-radius:canvas.width+radius;
      y=Math.random()*canvas.height;
    }else {
      x=Math.random()*canvas.width
      y=Math.random()<0.5?0-radius:canvas.height+radius;
    }
    
             
    const color=`hsl(${Math.random()*360},50%,50%)`;
    const angle=Math.atan2((canvas.height/2)-y,
   (canvas.width/2)-x);
  
    const velocity={
      x:Math.cos(angle),
      y:Math.sin(angle)
    }
 enemies.push(new Enemy(x,y,radius,color,velocity))
  },1000)
}

let animetionId;
function animate(){
 animetionId=requestAnimationFrame(animate);

  c.fillStyle='rgba(0,0,0,0.1)'
  c.fillRect(0,0,canvas.width,canvas.height);
  player.drow();

particles.forEach((part,index)=>{
  if(part.alpha<=0){
    particles.splice(index,1);
  }else{
    part.updata()
  
  }

}
  
  )

  projectils.forEach((p,index)=>{
    p.updata()
  if(p.x+p.radius<0 ||p.x-p.radius>canvas.width||p.y+p.radius<0||p.y-p.radius>canvas.height){
    setTimeout(()=>{
      projectils.splice(index,1);
    },0)
  }
  
  });

  enemies.forEach((enemy,eindex)=>{
    enemy.updata()

   //colis enemy with player:end game
    const dist=Math.hypot(player.x-enemy.x,player.y-enemy.y);
    if(dist-enemy.radius-player.radius<1){
      cancelAnimationFrame(animetionId);
      clearInterval(creatEnmeId);
      document.getElementById('start-game').style.display='flex';
      document.querySelector('[class="score-p"]').innerText=score;
    }
 //colis enemy with projectils:
    projectils.forEach((p,pindex)=>{
    const dist=Math.hypot(p.x-enemy.x,p.y-enemy.y);
    if(dist-enemy.radius-p.radius<1){
   
      //partical effict
for(let i=0;i<enemy.radius*2;i++){
particles.push(new Particle(enemy.x,enemy.y,Math.random()*2,enemy.color,
{x:(Math.random()-0.5)*(Math.random()*6),
  y:(Math.random()-0.5)*(Math.random()*6)}
  ));
}

      if(enemy.radius-10>10){
        score+=100;
        scoreLe.innerText=score
        gsap.to(enemy,{
          radius: enemy.radius-5
        })
       
        setTimeout(()=>{
          projectils.splice(pindex,1)
        },0)
      }else {
        score+=250;
        scoreLe.innerText=score
        setTimeout(()=>{
          enemies.splice(eindex,1);
          projectils.splice(pindex,1)
        },0)
      }
     
    }

    });
  });
  
}
window.addEventListener('click',event=>{
  // const projectile=new Projectile(event.clientX,event.clientY,5,'red',null);
  const angle=Math.atan2(event.clientY-(canvas.height/2),
  event.clientX-(canvas.width/2)
  );
  const speed=5;
  const velocity={
    x:Math.cos(angle)*speed,
    y:Math.sin(angle)*speed
  }
    projectils.push(new Projectile(canvas.width/2,canvas.height/2,5,'white',velocity));

})

document.getElementById('start-btn').addEventListener('click',()=>{
  document.getElementById('start-game').style.display='none';
 projectils=[];
 enemies=[]
 particles=[]
 score=0;
 scoreLe.innerText=0;
  animate();
  spawnEnemies()
})
