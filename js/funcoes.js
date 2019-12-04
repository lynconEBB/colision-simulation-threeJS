var cena;
var camera;
var renderer;
var largura=window.innerWidth;
var altura=window.innerHeight;
var f_atrito=0.05;

var esferas= {
    x:[-525,300,405,405,525,525,525,660,660,660,660],
    y:[0 ,0  ,52 ,-52,100 ,-100 ,0 ,160,-55,-160,55],
    raio: 50,
    segmentos: 20,
    aneis: 15,
    _esferas:[],
    textura:["img/esfera1.png","img/esfera2.png","img/esfera3.jpg","img/esfera4.jpg","img/esfera5.png",
        "img/esfera6.jpg","img/esfera7.jpg","img/esfera8.png","img/esfera9.jpg","img/esfera10.png","img/esfera10.png"],
    dirH: [0,3,3,3,3,3,3,3,3,3],         //0 = direita           1 = esquerda
    dirV: [3,3,3,3,3,3,3,3,3,3],         //0 = cima              1 = baixo
    desenha: function () {
        for(i=0;i<11;i++) {
            this._esferas.push({
                velocidade:0,
                texturaEsfera : new THREE.TextureLoader().load(this.textura[i]),
                materialEsfera :"",
                geometriaEsfera : new THREE.SphereGeometry(this.raio, this.segmentos, this.aneis),
                desenhoEsfera : "",
                dirH:this.dirH[i],
                dirV:this.dirV[i]
            });
            if(i==0){
                this._esferas[i].velocidade=150;
            }
            this._esferas[i].materialEsfera =  new THREE.MeshBasicMaterial({map: this._esferas[i].texturaEsfera});
            this._esferas[i].desenhoEsfera = new THREE.Mesh(this._esferas[i].geometriaEsfera, this._esferas[i].materialEsfera);
            cena.add(this._esferas[i].desenhoEsfera);
            this._esferas[i].desenhoEsfera.position.x=this.x[i];
            this._esferas[i].desenhoEsfera.position.y=this.y[i];
        }
    },
    verificaColisao:function () {
        for(o=0;o<this._esferas.length;o++){
            for(i=0;i<this._esferas.length;i++){
                if(i!=o){
                    bola1 = this._esferas[o].desenhoEsfera;
                    bola2 = this._esferas[i].desenhoEsfera;
                    cx1=bola1.position.x;    cy1=bola1.position.y+this.raio;
                    bx1=bola1.position.x;    by1=bola1.position.y-this.raio;
                    dx1=bola1.position.x+this.raio;  dy1=bola1.position.y;
                    ex1=bola1.position.x-this.raio;  ey1=bola1.position.y;

                    cx2=bola2.position.x;    cy2=bola2.position.y+this.raio;
                    bx2=bola2.position.x;    by2=bola2.position.y-this.raio;
                    dx2=bola2.position.x+this.raio;  dy2=bola2.position.y;
                    ex2=bola2.position.x-this.raio;  ey2=bola2.position.y;

                    diagDCx=cx1+25;      diagDCy=cy1-20;
                    diagECx=cx1-25;      diagECy=cy1-20;
                    diagDBx=bx1+25;      diagDBy=by1+20;
                    diagEBx=bx1-25;      diagEBy=by1+20;

                    if(diagDCx>ex2 && diagDCy>by2 && diagDCy<(by2+40) && diagDCx<(ex2+40)){
                        this._esferas[i].dirV=0;
                        this._esferas[o].dirV=1;
                        this._esferas[i].dirH=0;
                        this._esferas[o].dirH=1;
                        fisica(this._esferas[o],this._esferas[i]);
                    }
                    if(diagECx<dx2 && diagECy>by2 && diagECy<(by2+40) && diagECx>(dx2-40)){
                        this._esferas[i].dirH=1;
                        this._esferas[i].dirV=0;
                        this._esferas[o].dirV=1;
                        this._esferas[o].dirH=0;
                        fisica(this._esferas[o],this._esferas[i]);
                    }
                    if(diagDBx>ex2 && diagDBy<cy2 && diagDBy>(cy2-40) && diagDBx<(ex2+40)){
                        this._esferas[i].dirV=1;
                        this._esferas[o].dirV=0;
                        this._esferas[i].dirH=0;
                        this._esferas[o].dirH=1;
                        fisica(this._esferas[o],this._esferas[i]);
                    }
                    if(diagEBx<dx2 && diagEBy<cy2 && diagEBy>(cy2-40) && diagEBx>(dx2-40)){
                        this._esferas[i].dirV=1;
                        this._esferas[o].dirV=0;
                        this._esferas[i].dirH=1;
                        this._esferas[o].dirH=0;
                        fisica(this._esferas[o],this._esferas[i]);
                    }
                    if (cy1>by2 &&  bola1.position.x<dx2 && bola1.position.x>ex2 && cy1<(by2+50)) {
                        this._esferas[i].dirV=0;
                        this._esferas[o].dirV=1;
                        fisica(this._esferas[o],this._esferas[i]);
                    }if (by1<cy2 &&  bola1.position.x<dx2 && bola1.position.x>ex2 && by1>(cy2-50)) {
                        this._esferas[i].dirV=1;
                        this._esferas[o].dirV=0;
                        fisica(this._esferas[o],this._esferas[i]);
                    }
                    if (dx1 > ex2 && bola1.position.y < cy2 && bola1.position.y > by2 && dx1 < (ex2 + 50)) {
                        this._esferas[i].dirH=0;
                        this._esferas[o].dirH=1;
                        fisica(this._esferas[o],this._esferas[i]);
                    }
                    if (ex1 < dx2 && bola1.position.y < cy2 && bola1.position.y > by2 && ex1 > (dx2 - 50)) {
                        this._esferas[i].dirH=1;
                        this._esferas[o].dirH=0;
                        fisica(this._esferas[o],this._esferas[i]);
                    }



                }
            }
            if(-(largura/2)>this._esferas[o].desenhoEsfera.position.x-this.raio){
                this._esferas[o].dirH=0;
            }
            if((largura/2)<this._esferas[o].desenhoEsfera.position.x+this.raio){
                this._esferas[o].dirH=1;
            }
            if(-(altura/2)>this._esferas[o].desenhoEsfera.position.y-this.raio){
                this._esferas[o].dirV=0;
            }
            if((altura/2)<this._esferas[o].desenhoEsfera.position.y+this.raio){
                this._esferas[o].dirV=1;
            }
            if(this._esferas[o].velocidade>0) {
                if (this._esferas[o].dirH == 0) {
                    this._esferas[o].desenhoEsfera.position.x += this._esferas[o].velocidade;
                    this._esferas[o].desenhoEsfera.rotation.y += this._esferas[o].velocidade*0.02;
                } else if (this._esferas[o].dirH == 1) {
                    this._esferas[o].desenhoEsfera.position.x -= this._esferas[o].velocidade;
                    this._esferas[o].desenhoEsfera.rotation.y -= this._esferas[o].velocidade*0.02;
                }
                if (this._esferas[o].dirV == 0) {
                    this._esferas[o].desenhoEsfera.position.y += this._esferas[o].velocidade;
                    this._esferas[o].desenhoEsfera.rotation.x -= this._esferas[o].velocidade*0.02;
                } else if (this._esferas[o].dirV == 1) {
                    this._esferas[o].desenhoEsfera.position.y -= this._esferas[o].velocidade;
                    this._esferas[o].desenhoEsfera.rotation.x += this._esferas[o].velocidade*0.02;
                }
            }
        }
    }
};

function atrito(){
        for(i=0;i<esferas._esferas.length;i++){
            if(esferas._esferas[i].velocidade>0){
                esferas._esferas[i].velocidade-=f_atrito;
            }
        }
}

function fisica(bola1,bola2) {
    velo1= bola1.velocidade;
    velo2 = bola2.velocidade;
    velo = (velo1+velo2)/2;
    bola2.velocidade =  velo;
    bola1.velocidade=velo;
}

function inicio() {
  cena = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75,largura/altura,1,1000);
  camera.position.z=600;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(largura,altura);

  document.body.appendChild(renderer.domElement);
  esferas.desenha();
  renderizar();
}

function renderizar() {
    renderer.render(cena, camera);
    requestAnimationFrame(renderizar);
    esferas.verificaColisao();
    atrito();
}
window.onload=inicio();

