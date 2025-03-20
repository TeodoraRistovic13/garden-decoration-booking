export class ElemBaste{

  x : number = 0;
  y : number = 0;
  type : string = '';

  constructor(x : number, y: number, type: string){

    this.x = x;
    this.y = y;
    this.type = type;

  }

  isOverlaping(e : ElemBaste):boolean{
    return false;
  }
}

export class PravougaonikElem extends ElemBaste{

  width : number = 0;
  height : number = 0;

  constructor(x : number, y: number, w: number, h: number, type: string){
    super(x, y, type);
    this.width = w;
    this.height = h;
  }

  tackaUPravougaoniku(x: number, y : number){
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  override isOverlaping(e: ElemBaste): boolean {
    if(e instanceof KrugELem){
      const closestX = Math.max(this.x, Math.min(e.x, this.x + this.width));
      const closestY = Math.max(this.y, Math.min(e.y, this.y + this.height));
      const distanceX = e.x - closestX;
      const distanceY = e.y - closestY;
      return (distanceX * distanceX + distanceY * distanceY) <= (e.radius * e.radius);
    }

    if(e instanceof PravougaonikElem){
      return !(this.x + this.width < e.x || e.x + e.width < this.x || this.y + this.height < e.y || e.y + e.height < this.y);
    }
    return false;
  }

}

export class KrugELem extends ElemBaste{

  radius : number = 0;

  constructor(x : number, y: number, r: number, type: string){

    super(x, y, type);
    this.radius = r;

  }

  override isOverlaping(e: ElemBaste): boolean {

    if(e instanceof KrugELem){
      let uslov = (e.x-this.x)*(e.x-this.x) + (e.y-this.y)*(e.y-this.y) <= (e.radius + this.radius)*(e.radius + this.radius)
      if(uslov) return true;
    }

    if(e instanceof PravougaonikElem){
      return e.isOverlaping(this);
    }

    return false;
  }

}

