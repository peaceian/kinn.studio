// Local, dependency-free WebGL product viewer. Geometry approximates supplied photos.
window.createEyewearViewer=function(host){
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.append(canvas);
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true});if(!gl){canvas.remove();return null}
 const vs=`attribute vec3 p;attribute vec3 n;attribute vec3 c;uniform vec2 rotation;uniform float aspect;uniform float zoom;uniform float bob;varying vec3 color;varying vec3 normal;varying vec3 pos;void main(){float a=rotation.x,b=rotation.y;mat3 ry=mat3(cos(b),0.,-sin(b),0.,1.,0.,sin(b),0.,cos(b));mat3 rx=mat3(1.,0.,0.,0.,cos(a),sin(a),0.,-sin(a),cos(a));vec3 v=rx*ry*p;normal=rx*ry*n;color=c;pos=v;float d=8.5-v.z;gl_Position=vec4(v.x*zoom/aspect,(v.y+bob)*zoom,(d-2.)/12.*d,d);}`;
 const fs=`precision mediump float;uniform float opacity;varying vec3 color;varying vec3 normal;varying vec3 pos;void main(){vec3 n=normalize(normal);if(!gl_FrontFacing)n=-n;vec3 light=normalize(vec3(-.5,1.,1.8));float diffuse=max(dot(n,light),0.);float shine=pow(max(dot(n,normalize(light+normalize(vec3(0.,0.,8.5)-pos))),0.),48.);float rim=pow(1.-abs(dot(n,normalize(vec3(0.,0.,8.5)-pos))),3.);gl_FragColor=vec4(color*(.55+.45*diffuse)+vec3(shine*.38+rim*.045),opacity);}`;
 function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
 let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('link');}catch(e){canvas.remove();return null}
 gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);for(const [i,key]of ['p','n','c'].entries()){const a=gl.getAttribLocation(program,key);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,36,i*12)}
 const uniforms=Object.fromEntries(['rotation','aspect','zoom','bob','opacity'].map(k=>[k,gl.getUniformLocation(program,k)]));gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
 let transparent=[];let data=[],count=0,rx=-.30,ry=-.42,scale=1,selected=0,active=true,raf=0;
 const configs=[{w:1.03,h:.67,p:.48,t:.11,frame:[.035,.036,.033],lens:[.35,.25,.13]}, {w:1.04,h:.72,p:.65,t:.04,frame:[.64,.45,.25],lens:[.53,.38,.32]}, {w:1.04,h:.76,p:.76,t:.025,frame:[.66,.48,.24],lens:[.37,.26,.18],aviator:true}, {w:1.02,h:.71,p:.56,t:.105,frame:[.025,.027,.029],lens:[.16,.17,.18]}, {w:1.06,h:.76,p:.50,t:.032,frame:[.42,.30,.32],lens:[.31,.25,.37],split:true}, {w:1.11,h:.86,p:.46,t:.085,frame:[.29,.19,.16],lens:[.44,.32,.36]}];
 function tri(a,b,c,color){const u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]);const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const len=Math.hypot(...n)||1;for(const p of [a,b,c])data.push(...p,...n.map(x=>x/len),...color)}
 function quad(a,b,c,d,color){tri(a,b,c,color);tri(a,c,d,color)}
 function tube(points,r,color){for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],axis=b.map((x,j)=>x-a[j]),l=Math.hypot(...axis);const d=axis.map(x=>x/l),ref=Math.abs(d[1])<.9?[0,1,0]:[1,0,0];let u=[d[1]*ref[2]-d[2]*ref[1],d[2]*ref[0]-d[0]*ref[2],d[0]*ref[1]-d[1]*ref[0]];const ul=Math.hypot(...u);u=u.map(x=>x/ul);const v=[d[1]*u[2]-d[2]*u[1],d[2]*u[0]-d[0]*u[2],d[0]*u[1]-d[1]*u[0]];const at=(p,k)=>p.map((x,j)=>x+r*(u[j]*Math.cos(k*Math.PI/6)+v[j]*Math.sin(k*Math.PI/6)));for(let k=0;k<12;k++){quad(at(a,k),at(a,k+1),at(b,k+1),at(b,k),color);tri(a,at(a,k+1),at(a,k),color);tri(b,at(b,k),at(b,k+1),color)}}}

 // Frame 01: hand-fitted to IMG_5428–5432 front, rear and temple views.
 // Dimensionless proportions, not calibrated manufacturing measurements.
 function refinedTea(){
  const black=[.018,.021,.020],brown=[.36,.285,.16],silver=[.64,.66,.64];
  function bezier(a,b,c,d,n=18){return Array.from({length:n},(_,i)=>{const t=i/n,u=1-t;return a.map((v,j)=>u*u*u*v+3*u*u*t*b[j]+3*u*t*t*c[j]+t*t*t*d[j])})}
  const outline=[
   ...bezier([.31,.47],[.40,.70],[1.53,.74],[2.30,.53]),
   ...bezier([2.30,.53],[2.42,.48],[2.25,-.27],[2.03,-.48]),
   ...bezier([2.03,-.48],[1.84,-.66],[.81,-.66],[.59,-.48]),
   ...bezier([.59,-.48],[.46,-.33],[.39,.15],[.31,.47])];
  const cx=1.32,cy=.025;
  function at(v,side,shrink,z){const x=cx+(v[0]-cx)*shrink,y=cy+(v[1]-cy)*shrink;return [x*side,y,z-.055*(x-1.25)**2]}
  function join(a,b,color){for(let i=0;i<a.length;i++){const j=(i+1)%a.length;quad(a[i],a[j],b[j],b[i],color)}}
  // Flat front and back faces, rolled bevels, and real inner/outer walls.
  for(const side of [-1,1]){
   const loops=[[1,1.39],[1,1.53],[.979,1.566],[.87,1.566],[.852,1.535],[.852,1.392],[.874,1.367],[.976,1.367]].map(([scale,z])=>outline.map(v=>at(v,side,scale,z)));
   for(let k=0;k<loops.length;k++)join(loops[k],loops[(k+1)%loops.length],black);
   // Slightly convex brown lenses with enclosed front, rear and edge surfaces.
   const lensLoops=[];
   for(let r=0;r<=12;r++){const t=r/12;lensLoops.push(outline.map(v=>{const a=at(v,side,.86*t,1.445+.036*(1-t*t));return a}))}
   for(let r=1;r<lensLoops.length;r++)join(lensLoops[r-1],lensLoops[r],brown);
   const back=lensLoops.at(-1).map(v=>[v[0],v[1],v[2]-.035]);join(lensLoops.at(-1),back,brown);
   for(let i=0;i<back.length;i++)tri([side*cx,cy,1.42],back[(i+1)%back.length],back[i],brown);
   // A tapered rounded rectangular temple, continuously curved at the ear.
   const path=[
    ...bezier([2.30,.42,1.43,.11,.055],[2.42,.42,1.15,.105,.05],[2.44,.40,.30,.075,.038],[2.39,.39,-.75,.067,.035],36),
    ...bezier([2.39,.39,-.75,.067,.035],[2.38,.40,-1.22,.064,.036],[2.25,.35,-1.57,.071,.043],[2.18,.12,-1.85,.086,.047],24),
    ...bezier([2.18,.12,-1.85,.086,.047],[2.15,-.03,-2.02,.093,.045],[2.08,-.20,-2.13,.072,.04],[2.01,-.20,-2.16,.008,.008],18),[2.01,-.20,-2.16,.008,.008]];
   const sections=path.map(v=>Array.from({length:20},(_,i)=>{const a=i/20*Math.PI*2;return [side*(v[0]+v[4]*Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.6),v[1]+v[3]*Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.6,v[2]]}));
   for(let i=1;i<sections.length;i++)join(sections[i-1],sections[i],black);
   for(const k of [0,sections.length-1])for(let i=0;i<20;i++)tri([side*path[k][0],path[k][1],path[k][2]],sections[k][i],sections[k][(i+1)%20],black);
   // Small silver hinges inside the frame; the outside remains plain black.
   tube([[side*2.22,.37,1.32],[side*2.27,.37,1.14]],.035,silver);
   tube([[side*2.25,.30,1.30],[side*2.25,.44,1.30]],.028,silver);
   // Integrated black nose support, no separate clear nose pads on this model.
   tube([[side*.39,.20,1.42],[side*.43,-.02,1.31],[side*.47,-.17,1.28]],.065,black);
  }
  const bridge=[...bezier([-.34,.47,1.52],[-.21,.29,1.54],[.21,.29,1.54],[.34,.47,1.52],32),[.34,.47,1.52]];
  tube(bridge,.071,black);
  // Average shared vertex normals for smooth acetate and curved temple highlights.
  const normals=new Map();const key=i=>data.slice(i,i+3).map(v=>v.toFixed(5)).join(',')+':'+data.slice(i+6,i+9).join(',');
  for(let i=0;i<data.length;i+=9){const k=key(i),n=normals.get(k)||[0,0,0];for(let j=0;j<3;j++)n[j]+=data[i+3+j];normals.set(k,n)}
  for(let i=0;i<data.length;i+=9){const n=normals.get(key(i)),l=Math.hypot(...n)||1;for(let j=0;j<3;j++)data[i+3+j]=n[j]/l}
 }

 // Frame 04 rebuilt from nine views IMG_5468–5476; photo-based proportions.
 function refinedNight(){
  const black=[.018,.021,.020],brown=[.115,.135,.15],silver=[.64,.66,.64];
  function bezier(a,b,c,d,n=18){return Array.from({length:n},(_,i)=>{const t=i/n,u=1-t;return a.map((v,j)=>u*u*u*v+3*u*u*t*b[j]+3*u*t*t*c[j]+t*t*t*d[j])})}
  // Taller wayfarer silhouette, a raised outer brow and a rounded tapered base.
  const outline=[...bezier([.29,.40],[.43,.84],[1.17,.90],[2.45,.72]),...bezier([2.45,.72],[2.46,.51],[2.37,.09],[2.20,-.35]),...bezier([2.20,-.35],[2.09,-.75],[1.90,-.84],[1.43,-.85]),...bezier([1.43,-.85],[.80,-.86],[.55,-.70],[.48,-.39]),...bezier([.48,-.39],[.39,-.15],[.28,.12],[.29,.40])];
  const cx=1.32,cy=.025;
  function at(v,side,shrink,z){const x=cx+(v[0]-cx)*shrink,y=cy+(v[1]-cy)*shrink;return [x*side,y,z-.055*(x-1.25)**2]}
  function join(a,b,color){for(let i=0;i<a.length;i++){const j=(i+1)%a.length;quad(a[i],a[j],b[j],b[i],color)}}
  // Flat front and back faces, rolled bevels, and real inner/outer walls.
  for(const side of [-1,1]){
   const loops=[[1,1.36],[1,1.55],[.978,1.588],[.83,1.588],[.814,1.550],[.814,1.365],[.834,1.335],[.976,1.335]].map(([scale,z])=>outline.map(v=>at(v,side,scale,z)));
   for(let k=0;k<loops.length;k++)join(loops[k],loops[(k+1)%loops.length],black);
   // A dark, uniform smoke lens; slight transparency preserves rear details.
   const opaque=data;data=[];const lensLoops=[];
   for(let r=0;r<=14;r++){const t=r/14;lensLoops.push(outline.map(v=>at(v,side,.823*t,1.445+.04*(1-t*t))))}
   for(let r=1;r<lensLoops.length;r++)join(lensLoops[r-1],lensLoops[r],brown);
   transparent.push({alpha:.91,center:[side*cx,cy,1.45],vertices:new Float32Array(data)});data=opaque;
   // A tapered rounded rectangular temple, continuously curved at the ear.
   const path=[...bezier([2.43,.49,1.43,.145,.057],[2.53,.49,.98,.139,.052],[2.53,.48,.04,.127,.041],[2.46,.49,-.69,.069,.035],36),...bezier([2.46,.49,-.69,.069,.035],[2.44,.49,-1.13,.062,.034],[2.32,.40,-1.52,.071,.040],[2.22,.13,-1.82,.091,.044],24),...bezier([2.22,.13,-1.82,.091,.044],[2.20,-.04,-2.01,.106,.049],[2.11,-.23,-2.16,.083,.041],[2.02,-.23,-2.19,.012,.011],18),[2.02,-.23,-2.19,.012,.011]];
   const sections=path.map(v=>Array.from({length:20},(_,i)=>{const a=i/20*Math.PI*2;return [side*(v[0]+v[4]*Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.6),v[1]+v[3]*Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.6,v[2]]}));
   for(let i=1;i<sections.length;i++)join(sections[i-1],sections[i],black);
   for(const k of [0,sections.length-1])for(let i=0;i<20;i++)tri([side*path[k][0],path[k][1],path[k][2]],sections[k][i],sections[k][(i+1)%20],black);
   // Silver internal hinge barrels and rectangular corner inlays.
   tube([[side*2.32,.47,1.30],[side*2.38,.47,1.14]],.035,silver);
   tube([[side*2.36,.39,1.28],[side*2.36,.55,1.28]],.028,silver);
   // Solid corner block and small metal plaque, seated on the forward face.
   function block(x0,x1,y0,y1,z0,z1,color){const front=[[side*x0,y0,z1],[side*x1,y0,z1],[side*x1,y1,z1],[side*x0,y1,z1]],back=front.map(v=>[v[0],v[1],z0]);join(front,back,color);quad(...front,color);quad(...back,color)}
   block(2.31,2.47,.32,.70,1.33,1.565,black);block(2.367,2.451,.385,.63,1.563,1.576,[.66,.64,.57]);
   // Integrated black nose support, no separate clear nose pads on this model.
   tube([[side*.39,.20,1.40],[side*.43,-.02,1.25],[side*.47,-.22,1.23]],.095,black);
  }
  const bridge=[...bezier([-.34,.47,1.52],[-.21,.29,1.54],[.21,.29,1.54],[.34,.47,1.52],32),[.34,.47,1.52]];
  tube(bridge,.105,black);
  // Average shared vertex normals for smooth acetate and curved temple highlights.
  const normals=new Map();const key=i=>data.slice(i,i+3).map(v=>v.toFixed(5)).join(',')+':'+data.slice(i+6,i+9).join(',');
  for(let i=0;i<data.length;i+=9){const k=key(i),n=normals.get(k)||[0,0,0];for(let j=0;j<3;j++)n[j]+=data[i+3+j];normals.set(k,n)}
  for(let i=0;i<data.length;i+=9){const n=normals.get(key(i)),l=Math.hypot(...n)||1;for(let j=0;j<3;j++)data[i+3+j]=n[j]/l}
 }

 // Frame 02: proportions fitted to IMG_5433–5440, not measured CAD dimensions.
 function refinedGold(){
  const gold=[.70,.53,.30],champagne=[.67,.49,.32],rose=[.60,.44,.39];
  const bez=(a,b,c,d,n=20)=>Array.from({length:n},(_,i)=>{const t=i/n,u=1-t;return a.map((v,j)=>u*u*u*v+3*u*u*t*b[j]+3*u*t*t*c[j]+t*t*t*d[j])});
  const outline=[...bez([.30,.25],[.34,.89],[.81,.91],[1.42,.86]),...bez([1.42,.86],[1.77,.84],[2.30,.75],[2.35,.66]),...bez([2.35,.66],[2.45,.49],[2.30,-.39],[2.06,-.62]),...bez([2.06,-.62],[1.88,-.83],[.80,-.91],[.49,-.51]),...bez([.49,-.51],[.34,-.29],[.29,-.01],[.30,.25])];
  const cx=1.32,cy=.03;
  const join=(a,b,color)=>{for(let i=0;i<a.length;i++){const j=(i+1)%a.length;quad(a[i],a[j],b[j],b[i],color)}};
  function smooth(){const sums=new Map(),key=i=>data.slice(i,i+3).map(v=>v.toFixed(5)).join(',')+':'+data.slice(i+6,i+9).join(',');for(let i=0;i<data.length;i+=9){const k=key(i),n=sums.get(k)||[0,0,0];for(let j=0;j<3;j++)n[j]+=data[i+3+j];sums.set(k,n)}for(let i=0;i<data.length;i+=9){const n=sums.get(key(i)),l=Math.hypot(...n)||1;for(let j=0;j<3;j++)data[i+3+j]=n[j]/l}}
  function translucent(alpha,center,make){const opaque=data;data=[];make();smooth();transparent.push({alpha,center,vertices:new Float32Array(data)});data=opaque}
  function sweep(path,color){const sections=path.map(v=>Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2;return[v[0]+v[4]*Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.55,v[1]+v[3]*Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.55,v[2]]}));for(let i=1;i<sections.length;i++)join(sections[i-1],sections[i],color);for(const k of [0,sections.length-1])for(let i=0;i<16;i++)tri(path[k].slice(0,3),sections[k][i],sections[k][(i+1)%16],color)}
  for(const side of [-1,1]){
   const at=(v,r,z)=>{const x=cx+(v[0]-cx)*r;return[side*x,cy+(v[1]-cy)*r,z-.055*(x-1.25)**2]};
   // Rounded champagne surround with a fine metallic line front and rear.
   const layers=[[1,1.41],[1,1.51],[.988,1.535],[.947,1.535],[.933,1.51],[.933,1.41],[.949,1.389],[.986,1.389]].map(([r,z])=>outline.map(v=>at(v,r,z)));
   for(let i=0;i<layers.length;i++)join(layers[i],layers[(i+1)%layers.length],champagne);
   for(const z of [1.532,1.387]){const ring=outline.map(v=>at(v,.965,z));ring.push(ring[0]);tube(ring,.011,gold)}
   translucent(.64,[side*cx,cy,1.45],()=>{let prev=outline.map(v=>at(v,0,1.477));for(let i=1;i<=12;i++){const t=i/12,ring=outline.map(v=>at(v,.94*t,1.445+.032*(1-t*t)));join(prev,ring,rose);prev=ring}});
   // Curved metal nose bridge and articulated, clear oval nose pads.
   const support=[...bez([side*.32,-.18,1.40],[side*.25,-.22,1.25],[side*.30,-.35,1.18],[side*.39,-.37,1.16],14),[side*.39,-.37,1.16]];tube(support,.021,gold);
   translucent(.34,[side*.38,-.39,1.14],()=>{const rings=[];for(let j=0;j<=12;j++){const lat=j/12*Math.PI;const ring=[];for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=.085*Math.sin(lat)*Math.cos(a),y=.175*Math.cos(lat);ring.push([side*(.39+x+.30*y),-.39+y,1.13+.037*Math.sin(lat)*Math.sin(a)])}rings.push(ring)}for(let j=1;j<rings.length;j++)join(rings[j-1],rings[j],[.88,.86,.80])});
   tube([[side*.375,-.37,1.16],[side*.40,-.40,1.13]],.031,gold);
   // Hinges and straight, flat metal temples, then a thicker curved ear sleeve.
   tube([[side*2.35,.38,1.40],[side*2.47,.36,1.28],[side*2.49,.36,1.18]],.038,gold);
   tube([[side*2.46,.30,1.23],[side*2.46,.41,1.23]],.029,gold);
   const stem=[...bez([2.48,.36,1.19,.042,.023],[2.52,.35,.72,.038,.020],[2.50,.32,-.15,.028,.017],[2.47,.30,-.86,.027,.018],40),[2.47,.30,-.86,.027,.018]].map(v=>[v[0]*side,...v.slice(1)]);sweep(stem,gold);
   const tip=[...bez([2.47,.30,-.86,.043,.037],[2.47,.30,-1.13,.045,.037],[2.43,.27,-1.38,.048,.037],[2.37,.16,-1.55,.052,.038],20),...bez([2.37,.16,-1.55,.052,.038],[2.30,-.04,-1.80,.055,.038],[2.21,-.25,-2.08,.049,.034],[2.17,-.28,-2.13,.015,.018],22),[2.17,-.28,-2.13,.015,.018]].map(v=>[v[0]*side,...v.slice(1)]);sweep(tip,champagne);
   const core=tip.filter((v,i)=>i%3===0).map(v=>[v[0],v[1],v[2]+.012]);tube(core,.009,gold);
  }
  const bridge=[...bez([-.30,.25,1.46],[-.16,.16,1.49],[.16,.16,1.49],[.30,.25,1.46],28),[.30,.25,1.46]];tube(bridge,.031,gold);smooth();
 }

 // Frame 03: eight views IMG_5459–5466; uncalibrated visual proportions.
 function refinedAviator(){
  const gold=[.72,.58,.34],champagne=[.65,.51,.30],rose=[.40,.25,.14];
  const bez=(a,b,c,d,n=20)=>Array.from({length:n},(_,i)=>{const t=i/n,u=1-t;return a.map((v,j)=>u*u*u*v+3*u*u*t*b[j]+3*u*t*t*c[j]+t*t*t*d[j])});
  // Flat brow and lower edge joined by softened hexagonal corners.
  const outline=[...bez([.30,.27],[.32,.37],[.47,.70],[.58,.76]),...bez([.58,.76],[.67,.81],[1.91,.82],[2.13,.79]),...bez([2.13,.79],[2.25,.76],[2.49,.42],[2.48,.25]),...bez([2.48,.25],[2.47,-.14],[2.28,-.46],[2.03,-.64]),...bez([2.03,-.64],[1.84,-.80],[1.00,-.85],[.75,-.75]),...bez([.75,-.75],[.45,-.56],[.27,-.01],[.30,.27])];
  const cx=1.38,cy=.01;
  const join=(a,b,color)=>{for(let i=0;i<a.length;i++){const j=(i+1)%a.length;quad(a[i],a[j],b[j],b[i],color)}};
  function smooth(){const sums=new Map(),key=i=>data.slice(i,i+3).map(v=>v.toFixed(5)).join(',')+':'+data.slice(i+6,i+9).join(',');for(let i=0;i<data.length;i+=9){const k=key(i),n=sums.get(k)||[0,0,0];for(let j=0;j<3;j++)n[j]+=data[i+3+j];sums.set(k,n)}for(let i=0;i<data.length;i+=9){const n=sums.get(key(i)),l=Math.hypot(...n)||1;for(let j=0;j<3;j++)data[i+3+j]=n[j]/l}}
  function translucent(alpha,center,make){const opaque=data;data=[];make();smooth();transparent.push({alpha,center,vertices:new Float32Array(data)});data=opaque}
  function sweep(path,color){const sections=path.map(v=>Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2;return[v[0]+v[4]*Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.55,v[1]+v[3]*Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.55,v[2]]}));for(let i=1;i<sections.length;i++)join(sections[i-1],sections[i],color);for(const k of [0,sections.length-1])for(let i=0;i<16;i++)tri(path[k].slice(0,3),sections[k][i],sections[k][(i+1)%16],color)}
  for(const side of [-1,1]){
   const at=(v,r,z)=>{const x=cx+(v[0]-cx)*r;return[side*x,cy+(v[1]-cy)*r,z-.055*(x-1.25)**2]};
   // Thin rolled metal rims, with a darker inset lens seat.
   const layers=[[1,1.42],[1,1.49],[.992,1.506],[.974,1.506],[.963,1.49],[.963,1.42],[.975,1.408],[.991,1.408]].map(([r,z])=>outline.map(v=>at(v,r,z)));
   for(let i=0;i<layers.length;i++)join(layers[i],layers[(i+1)%layers.length],champagne);
   for(const z of [1.496,1.417]){const ring=outline.map(v=>at(v,.970,z));ring.push(ring[0]);tube(ring,.006,[.23,.17,.10])}
   translucent(.76,[side*cx,cy,1.45],()=>{let prev=outline.map(v=>at(v,0,1.477));for(let i=1;i<=12;i++){const t=i/12,ring=outline.map(v=>at(v,.968*t,1.445+.032*(1-t*t)));join(prev,ring,rose);prev=ring}for(let k=0;k<data.length;k+=9){const t=Math.max(0,Math.min(1,(data[k+1]+.80)/1.60));const bottom=[.84,.78,.64],top=[.25,.12,.055];for(let j=0;j<3;j++)data[k+6+j]=bottom[j]*(1-t)+top[j]*t}});
   // Curved metal nose bridge and articulated, clear oval nose pads.
   const support=[...bez([side*.32,-.18,1.40],[side*.25,-.22,1.25],[side*.30,-.35,1.18],[side*.39,-.37,1.16],14),[side*.39,-.37,1.16]];tube(support,.021,gold);
   translucent(.34,[side*.38,-.39,1.14],()=>{const rings=[];for(let j=0;j<=12;j++){const lat=j/12*Math.PI;const ring=[];for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=.085*Math.sin(lat)*Math.cos(a),y=.175*Math.cos(lat);ring.push([side*(.39+x+.30*y),-.39+y,1.13+.037*Math.sin(lat)*Math.sin(a)])}rings.push(ring)}for(let j=1;j<rings.length;j++)join(rings[j-1],rings[j],[.88,.86,.80])});
   tube([[side*.375,-.37,1.16],[side*.40,-.40,1.13]],.031,gold);
   // Hinges and straight, flat metal temples, then a thicker curved ear sleeve.
   tube([[side*2.47,.27,1.40],[side*2.65,.27,1.36],[side*2.66,.27,1.16]],.038,gold);
   tube([[side*2.63,.22,1.21],[side*2.63,.34,1.21]],.029,gold);
   const stem=[...bez([2.66,.27,1.16,.052,.023],[2.68,.27,.80,.048,.022],[2.64,.26,.08,.030,.017],[2.58,.25,-.82,.025,.016],40),[2.58,.25,-.82,.025,.016]].map(v=>[v[0]*side,...v.slice(1)]);sweep(stem,gold);
   // Fine lengthwise grooves at the wider hinge end, visible from the side.
   for(const offset of [-.018,0,.018])tube([[side*2.693,.27+offset,1.02],[side*2.686,.267+offset,.82],[side*2.672,.265+offset,.54]],.003,[.37,.27,.14]);
   const tip=[...bez([2.58,.25,-.82,.038,.030],[2.56,.25,-1.05,.043,.033],[2.54,.24,-1.30,.051,.036],[2.48,.10,-1.55,.053,.038],20),...bez([2.48,.10,-1.55,.053,.038],[2.41,-.07,-1.77,.060,.039],[2.33,-.27,-2.07,.065,.040],[2.26,-.29,-2.12,.012,.014],22),[2.26,-.29,-2.12,.012,.014]].map(v=>[v[0]*side,...v.slice(1)]);sweep(tip,[.018,.021,.019]);

  }
  const bridge=[...bez([-.30,.27,1.46],[-.25,.18,1.48],[.25,.18,1.48],[.30,.27,1.46],24),[.30,.27,1.46]];tube(bridge,.033,gold);
  // A flattened, rounded upper bar spanning both lens brows.
  const sections=[-1.59,-1.57,1.57,1.59].map((x,i)=>Array.from({length:20},(_,j)=>{const t=j/20*Math.PI*2,r=i===0||i===3?.75:1;return[x,.835+.026*r*Math.sign(Math.cos(t))*Math.abs(Math.cos(t))**.55,1.52+.044*r*Math.sign(Math.sin(t))*Math.abs(Math.sin(t))**.55]}));
  for(let i=1;i<sections.length;i++)join(sections[i-1],sections[i],gold);for(const k of [0,3])for(let j=0;j<20;j++)tri([k===0?-1.59:1.59,.835,1.52],sections[k][j],sections[k][(j+1)%20],gold);
  for(const y of [.825,.838,.850])tube([[-1.52,y,1.565],[1.52,y,1.565]],.0025,[.44,.34,.20]);smooth();
 }

 // Frame 05 fitted from ten views IMG_5448–5457; dimensionless visual reconstruction.
 function refinedViolet(){
  const gold=[.73,.61,.38],champagne=[.35,.275,.29],rose=[.36,.27,.39];
  const bez=(a,b,c,d,n=20)=>Array.from({length:n},(_,i)=>{const t=i/n,u=1-t;return a.map((v,j)=>u*u*u*v+3*u*u*t*b[j]+3*u*t*t*c[j]+t*t*t*d[j])});
  // Angular rounded square: broad brow, sloped outer corner, flatter lower rim.
  const outline=[...bez([.31,.34],[.34,.55],[.56,.81],[.78,.85]),...bez([.78,.85],[1.20,.88],[1.96,.83],[2.22,.67]),...bez([2.22,.67],[2.42,.53],[2.43,-.38],[2.21,-.66]),...bez([2.21,-.66],[2.07,-.82],[.84,-.87],[.57,-.68]),...bez([.57,-.68],[.37,-.50],[.28,.01],[.31,.34])];
  const cx=1.32,cy=.03;
  const join=(a,b,color)=>{for(let i=0;i<a.length;i++){const j=(i+1)%a.length;quad(a[i],a[j],b[j],b[i],color)}};
  function smooth(){const sums=new Map(),key=i=>data.slice(i,i+3).map(v=>v.toFixed(5)).join(',')+':'+data.slice(i+6,i+9).join(',');for(let i=0;i<data.length;i+=9){const k=key(i),n=sums.get(k)||[0,0,0];for(let j=0;j<3;j++)n[j]+=data[i+3+j];sums.set(k,n)}for(let i=0;i<data.length;i+=9){const n=sums.get(key(i)),l=Math.hypot(...n)||1;for(let j=0;j<3;j++)data[i+3+j]=n[j]/l}}
  function translucent(alpha,center,make){const opaque=data;data=[];make();smooth();transparent.push({alpha,center,vertices:new Float32Array(data)});data=opaque}
  function sweep(path,color){const sections=path.map(v=>Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2;return[v[0]+v[4]*Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.55,v[1]+v[3]*Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.55,v[2]]}));for(let i=1;i<sections.length;i++)join(sections[i-1],sections[i],color);for(const k of [0,sections.length-1])for(let i=0;i<16;i++)tri(path[k].slice(0,3),sections[k][i],sections[k][(i+1)%16],color)}
  for(const side of [-1,1]){
   const at=(v,r,z)=>{const x=cx+(v[0]-cx)*r;return[side*x,cy+(v[1]-cy)*r,z-.055*(x-1.25)**2]};
   // Slim mauve metal rim with a narrow dark lens seat.
   const layers=[[1,1.43],[1,1.50],[.99,1.516],[.957,1.516],[.947,1.50],[.947,1.43],[.958,1.414],[.989,1.414]].map(([r,z])=>outline.map(v=>at(v,r,z)));
   for(let i=0;i<layers.length;i++)join(layers[i],layers[(i+1)%layers.length],champagne);
   for(const z of [1.507,1.422]){const ring=outline.map(v=>at(v,.965,z));ring.push(ring[0]);tube(ring,.007,[.18,.14,.18])}
   translucent(.82,[side*cx,cy,1.45],()=>{let prev=outline.map(v=>at(v,0,1.477));for(let i=1;i<=12;i++){const t=i/12,ring=outline.map(v=>at(v,.94*t,1.445+.032*(1-t*t)));join(prev,ring,rose);prev=ring}for(let k=0;k<data.length;k+=9){const t=Math.max(0,Math.min(1,(data[k+1]+.85)/1.7));const bottom=[.61,.43,.47],top=[.13,.09,.21];for(let j=0;j<3;j++)data[k+6+j]=bottom[j]*(1-t)+top[j]*t}});
   // Curved metal nose bridge and articulated, clear oval nose pads.
   const support=[...bez([side*.32,-.18,1.40],[side*.25,-.22,1.25],[side*.30,-.35,1.18],[side*.39,-.37,1.16],14),[side*.39,-.37,1.16]];tube(support,.021,champagne);
   translucent(.34,[side*.38,-.39,1.14],()=>{const rings=[];for(let j=0;j<=12;j++){const lat=j/12*Math.PI;const ring=[];for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=.085*Math.sin(lat)*Math.cos(a),y=.175*Math.cos(lat);ring.push([side*(.39+x+.30*y),-.39+y,1.13+.037*Math.sin(lat)*Math.sin(a)])}rings.push(ring)}for(let j=1;j<rings.length;j++)join(rings[j-1],rings[j],[.88,.86,.80])});
   tube([[side*.375,-.37,1.16],[side*.40,-.40,1.13]],.031,[.30,.28,.28]);
   // Open twin rails, a long tapered aperture and curved mauve ear tips.
   tube([[side*2.36,.36,1.40],[side*2.47,.36,1.20]],.042,champagne);
   tube([[side*2.44,.26,1.28],[side*2.44,.44,1.28]],.030,champagne);
   const upper=[...bez([2.47,.48,1.22,.035,.022],[2.52,.46,.66,.032,.021],[2.51,.38,-.12,.028,.019],[2.45,.29,-.83,.029,.019],38),[2.45,.29,-.83,.029,.019]].map(v=>[side*v[0],...v.slice(1)]);sweep(upper,champagne);
   const lower=[...bez([2.47,.12,1.22,.036,.023],[2.51,.12,.72,.033,.021],[2.52,.07,.09,.028,.019],[2.48,.23,-.48,.025,.019],32),...bez([2.48,.23,-.48,.025,.019],[2.47,.26,-.61,.025,.019],[2.46,.28,-.72,.027,.019],[2.45,.29,-.83,.029,.019],10),[2.45,.29,-.83,.029,.019]].map(v=>[side*v[0],...v.slice(1)]);sweep(lower,champagne);
   // The paired gold D-shaped ornaments surround actual openings.
   for(const [z,flip] of [[1.00,1],[.66,-1]]){const points=[];for(let i=0;i<=28;i++){const t=-Math.PI/2+i/28*Math.PI;points.push([side*2.505,.30+.146*Math.sin(t),z+flip*.137*Math.cos(t)])}points.push(points[0]);tube(points,.022,gold)}
   tube([[side*2.49,.135,.825],[side*2.49,.465,.825]],.026,champagne);
   const tip=[...bez([2.45,.29,-.83,.044,.033],[2.43,.30,-1.10,.046,.035],[2.38,.27,-1.35,.049,.038],[2.32,.15,-1.59,.054,.040],20),...bez([2.32,.15,-1.59,.054,.040],[2.25,-.06,-1.83,.077,.045],[2.19,-.22,-2.10,.105,.047],[2.10,-.23,-2.17,.017,.019],22),[2.10,-.23,-2.17,.017,.019]].map(v=>[side*v[0],...v.slice(1)]);sweep(tip,champagne);

  }
  // Flat bridge body with an inset gold oblong surround on its front.
  // Bridge is a shallow closed rectangular solid; front ornament is a true loop.
  const front=[[-.33,.25,1.50],[.33,.25,1.50],[.33,.37,1.50],[-.33,.37,1.50]],back=front.map(v=>[v[0],v[1],1.42]);join(front,back,champagne);quad(...front,champagne);quad(...back,champagne);
  const oblong=[];for(let i=0;i<=60;i++){const t=i/60*Math.PI*2;oblong.push([.27*Math.sign(Math.cos(t))*Math.abs(Math.cos(t))**.45,.31+.037*Math.sin(t),1.513])}tube(oblong,.012,gold);smooth();
 }

 // Frame 06: IMG_5478–5488, photo-proportioned translucent acetate and gold links.
 function refinedDusk(){
  const gold=[.74,.58,.33],tea=[.28,.15,.13];
  const bez=(a,b,c,d,n=24)=>Array.from({length:n},(_,i)=>{const t=i/n,u=1-t;return a.map((v,j)=>u*u*u*v+3*u*u*t*b[j]+3*u*t*t*c[j]+t*t*t*d[j])});
  const outline=[...bez([.31,.40],[.38,.86],[.44,.98],[.75,.98]),...bez([.75,.98],[1.29,1.00],[2.03,.91],[2.40,.81]),...bez([2.40,.81],[2.58,.75],[2.53,-.54],[2.28,-.80]),...bez([2.28,-.80],[2.12,-1.01],[.88,-1.02],[.61,-.80]),...bez([.61,-.80],[.43,-.64],[.32,-.10],[.31,.40])];
  const cx=1.41,cy=0;
  const join=(a,b,color)=>{for(let i=0;i<a.length;i++){const j=(i+1)%a.length;quad(a[i],a[j],b[j],b[i],color)}};
  function smooth(){const sums=new Map(),key=i=>data.slice(i,i+3).map(v=>v.toFixed(5)).join(',')+':'+data.slice(i+6,i+9).join(',');for(let i=0;i<data.length;i+=9){const k=key(i),n=sums.get(k)||[0,0,0];for(let j=0;j<3;j++)n[j]+=data[i+3+j];sums.set(k,n)}for(let i=0;i<data.length;i+=9){const n=sums.get(key(i)),l=Math.hypot(...n)||1;for(let j=0;j<3;j++)data[i+3+j]=n[j]/l}}
  function translucent(alpha,center,make){const opaque=data;data=[];make();smooth();transparent.push({alpha,center,vertices:new Float32Array(data)});data=opaque}
  function sweep(path,color){const sections=path.map(v=>Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2;return[v[0]+v[4]*Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.55,v[1]+v[3]*Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.55,v[2]]}));for(let i=1;i<sections.length;i++)join(sections[i-1],sections[i],color);for(const k of [0,sections.length-1])for(let i=0;i<16;i++)tri(path[k].slice(0,3),sections[k][i],sections[k][(i+1)%16],color)}

  for(const side of [-1,1]){
   const at=(v,r,z)=>{const x=cx+(v[0]-cx)*r;return [side*x,cy+(v[1]-cy)*r,z-.075*(x-1.3)**2]};
   // Thick beveled clear tea surround. The front brow has a darker embedded core.
   translucent(.64,[side*cx,0,1.43],()=>{
    const loops=[[1,1.28],[1,1.54],[.985,1.58],[.905,1.58],[.884,1.54],[.884,1.30],[.905,1.265],[.982,1.265]].map(([r,z])=>outline.map(v=>at(v,r,z)));
    for(let i=0;i<loops.length;i++)join(loops[i],loops[(i+1)%loops.length],tea);
    for(let k=0;k<data.length;k+=9){const t=Math.max(0,Math.min(1,(data[k+1]+.8)/1.6));const low=[.77,.65,.58],high=[.23,.11,.09];for(let j=0;j<3;j++)data[k+6+j]=low[j]*(1-t)+high[j]*t}
   });
   const seat=outline.map(v=>at(v,.896,1.535));seat.push(seat[0]);tube(seat,.019,[.22,.12,.11]);
   translucent(.76,[side*cx,0,1.47],()=>{
    let prev=outline.map(v=>at(v,0,1.49));for(let i=1;i<=14;i++){const t=i/14,ring=outline.map(v=>at(v,.891*t,1.45+.04*(1-t*t)));join(prev,ring,tea);prev=ring}
    for(let k=0;k<data.length;k+=9){const t=Math.max(0,Math.min(1,(data[k+1]+.95)/1.9));const low=[.67,.46,.45],high=[.24,.15,.17];for(let j=0;j<3;j++)data[k+6+j]=low[j]*(1-t)+high[j]*t}
   });
   // Molded oval nose supports rise directly from the inner acetate rim.
   translucent(.72,[side*.43,-.17,1.23],()=>{
    const rings=[];for(let j=0;j<=16;j++){const lat=j/16*Math.PI;const ring=[];for(let i=0;i<24;i++){const t=i/24*Math.PI*2,y=.27*Math.cos(lat);ring.push([side*(.43+.105*Math.sin(lat)*Math.cos(t)-.20*y),-.17+y,1.28+.11*Math.sin(lat)*Math.sin(t)])}rings.push(ring)}for(let j=1;j<rings.length;j++)join(rings[j-1],rings[j],tea);
   });
   tube([[side*2.44,.39,1.29],[side*2.53,.39,1.14],[side*2.54,.39,.99]],.04,gold);
   tube([[side*2.52,.32,1.10],[side*2.52,.46,1.10]],.036,gold);
   // Paired rounded D openings and the solid central bar of the gold connector.
   for(const [z,flip] of [[.86,1],[.82,-1]]){const points=[];for(let i=0;i<=32;i++){const t=-Math.PI/2+i/32*Math.PI;points.push([side*2.55,.39+.105*Math.sin(t),z+flip*.18*Math.cos(t)])}points.push(points[0]);tube(points,.028,gold)}
   tube([[side*2.55,.29,.84],[side*2.55,.49,.84]],.034,gold);
   const path=[...bez([2.55,.39,.62,.047,.031],[2.58,.38,.14,.043,.03],[2.56,.35,-.56,.038,.027],[2.49,.33,-1.00,.037,.028],30),...bez([2.49,.33,-1,.037,.028],[2.46,.32,-1.37,.045,.032],[2.29,.05,-1.73,.064,.039],[2.16,-.25,-2.04,.081,.047],28),...bez([2.16,-.25,-2.04,.081,.047],[2.12,-.32,-2.13,.08,.043],[2.06,-.33,-2.18,.05,.025],[2.04,-.31,-2.20,.006,.006],10),[2.04,-.31,-2.20,.006,.006]].map(v=>[side*v[0],...v.slice(1)]);sweep(path,[.37,.22,.18]);
   // Fine embedded irregular linework along the outer edge, approximated from close-ups.
   for(let i=0;i<8;i++){const y=.67-i*.18,x=2.48-.09*((y-.1)**2);const points=[[side*x,y,1.30],[side*(x+.012),y+.04,1.35],[side*(x+.014),y-.035,1.40],[side*x,y+.025,1.49]];tube(points,.006,[.35,.23,.19]);}
  }
  const bridge=[...bez([-.33,.43,1.47],[-.20,.29,1.51],[.20,.29,1.51],[.33,.43,1.47],28),[.33,.43,1.47]];tube(bridge,.083,tea);smooth();
 }
 function build(index){selected=index;for(const part of transparent)if(part.buffer)gl.deleteBuffer(part.buffer);transparent=[];data=[];const cfg=configs[index];if(index===0){refinedTea()}else if(index===1){refinedGold()}else if(index===2){refinedAviator()}else if(index===3){refinedNight()}else if(index===4){refinedViolet()}else if(index===5){refinedDusk()}else{for(const side of [-1,1]){const cx=side*1.23,ring=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*2,x=Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**cfg.p,y=Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**cfg.p;ring.push([cx+x*cfg.w*(1+.075*y),y*cfg.h+.035*side*x,1.25-.075*x*x])}tube(ring,cfg.t,cfg.frame);
 for(let i=0;i<80;i++){const center=[cx,0,1.22],a=ring[i].map((v,j)=>j===2?v-.025:v),b=ring[i+1].map((v,j)=>j===2?v-.025:v);const brightness=cfg.aviator||index>3?1-.19*(a[1]+b[1]):1;tri(center,a,b,cfg.lens.map(x=>x*brightness));tri([cx,0,1.18],b.map((v,j)=>j===2?v-.04:v),a.map((v,j)=>j===2?v-.04:v),cfg.lens)}
 const x=side*(1.23+cfg.w);tube([[x,.38,1.2],[x+side*.13,.38,1.04],[x+side*.16,.32,-.85],[x+side*.09,.24,-1.55],[x-side*.18,-.05,-1.98]],cfg.t*.72,cfg.frame);tube([[x+side*.16,.32,-.85],[x+side*.09,.24,-1.55],[x-side*.18,-.05,-1.98]],Math.max(.042,cfg.t*.75),cfg.aviator?[.05,.05,.045]:cfg.frame);
 tube([[x,.38,1.13],[x+side*.10,.38,.96]],.065,[.63,.55,.40]);if(cfg.split)tube([[x,.30,1.03],[x+side*.12,.13,.34],[x+side*.16,.31,-.65]],.025,cfg.frame);
 if(cfg.t<.06){tube([[side*.32,0,1.15],[side*.36,-.19,1.02]],.025,cfg.frame);tube([[side*.36,-.19,1.02],[side*.39,-.34,.99]],.07,[.74,.67,.57])}}
 tube([[-.23,.15,1.24],[-.12,.06,1.21],[.12,.06,1.21],[.23,.15,1.24]],cfg.t*.85,cfg.frame);if(cfg.aviator)tube([[-1.4,.75,1.25],[0,.71,1.25],[1.4,.75,1.25]],.035,cfg.frame);
 }
 count=data.length/9;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);for(const part of transparent){part.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,part.buffer);gl.bufferData(gl.ARRAY_BUFFER,part.vertices,gl.STATIC_DRAW)}reset()}
 function bindGeometry(b){gl.bindBuffer(gl.ARRAY_BUFFER,b);for(const [i,key]of ['p','n','c'].entries())gl.vertexAttribPointer(gl.getAttribLocation(program,key),3,gl.FLOAT,false,36,i*12)}
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');function draw(t=0){raf=0;if(!active||document.hidden)return;gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform2f(uniforms.rotation,rx,ry);gl.uniform1f(uniforms.aspect,canvas.width/canvas.height);gl.uniform1f(uniforms.zoom,Math.min(3.1,3.1*canvas.width/canvas.height)*scale);gl.uniform1f(uniforms.bob,reduced.matches?0:Math.sin(t*.001)*.045);gl.disable(gl.BLEND);gl.depthMask(true);gl.uniform1f(uniforms.opacity,1);bindGeometry(buffer);gl.drawArrays(gl.TRIANGLES,0,count);
 if(transparent.length){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);const depth=p=>Math.sin(rx)*p.center[1]+Math.cos(rx)*(-Math.sin(ry)*p.center[0]+Math.cos(ry)*p.center[2]);for(const part of [...transparent].sort((a,b)=>depth(a)-depth(b))){bindGeometry(part.buffer);gl.uniform1f(uniforms.opacity,part.alpha);gl.drawArrays(gl.TRIANGLES,0,part.vertices.length/9)}gl.depthMask(true);gl.disable(gl.BLEND)}if(!reduced.matches)raf=requestAnimationFrame(draw)}function render(){if(!raf)raf=requestAnimationFrame(draw)}
 function reset(){rx=-.30;ry=-.42;scale=1;render()}function resize(){const r=host.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));render()}new ResizeObserver(resize).observe(host);
 const points=new Map();let pinch=0;canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);points.set(e.pointerId,[e.clientX,e.clientY]);pinch=points.size===2?distance():0});function distance(){const p=[...points.values()];return Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1])}canvas.addEventListener('pointermove',e=>{const old=points.get(e.pointerId);if(!old)return;points.set(e.pointerId,[e.clientX,e.clientY]);if(points.size===1){ry+=(e.clientX-old[0])*.012;rx+=(e.clientY-old[1])*.012}else if(points.size===2){const d=distance();if(pinch>0)scale=Math.max(.7,Math.min(1.7,scale*d/pinch));pinch=d}render()});for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{points.delete(e.pointerId);pinch=0});host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','+','-'].includes(e.key))return;e.preventDefault();if(e.key==='Home')reset();else if(e.key==='+')scale=Math.min(1.7,scale+.1);else if(e.key==='-')scale=Math.max(.7,scale-.1);else{ry+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;rx+=e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0}render()});document.addEventListener('visibilitychange',render);new IntersectionObserver(([e])=>{active=e.isIntersecting;render()}).observe(host);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();active=false;canvas.hidden=true;host.classList.remove('has-3d');document.querySelector('#viewer-help').textContent='3D 暫時無法顯示 · 請重新整理，或查看實拍照片'});canvas.addEventListener('webglcontextrestored',()=>location.reload());build(0);resize();return{select:build,reset,zoom(value){scale=value?1.4:1;render()},show(value){canvas.hidden=!value;active=value;render()}};
};
