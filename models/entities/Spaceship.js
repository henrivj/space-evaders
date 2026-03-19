import Entity from "./Entity.js"
import { canvas } from '../../index.js'

export default class Spaceship extends Entity{
    health = 500 
    // estou usando um valor alto para a vida pois assim, pelos asteroides nao terem protecao para causar apenas 1 de dano
    // cada tamanho de asteroide estara colidindo com o player por um tempo diferente. Asteroide maior significa mais dano
    // com nenhum trabalho. So preciso mudar a vida para uma barra, ao inves dos 3 coracoes que estava usando   
    direction = 0
    
    update(){
        this.posY += this.speed * this.direction
        // da loop na tela
        if(this.posY < 0 - this.size / 2) this.posY = canvas.height + this.size / 2
        if(this.posY > canvas.height + this.size / 2) this.posY = 0 - this.size / 2
    }

    reset(){
        
    }
}