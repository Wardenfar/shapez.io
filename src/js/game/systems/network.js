import { GameSystem } from "../game_system";

import io from 'socket.io-client';
import { ShapeDefinition } from "../shape_definition";

export class NetworkSystem extends GameSystem {

    constructor(root){
        super(root);
        
        this.client = io.connect("http://localhost:8000");
    
    }

    /**
     * @param {ShapeDefinition} shape 
     */
    sendShape(shape){
        if(this.client && this.client.connected){
            this.client.emit('send', {shape: shape.layers})   
        }
    }

    /**
     * @param {ShapeDefinition} shape 
     */
    getShape(shape){
        return new Promise((resolve, reject) => {
            if(this.client && this.client.connected){
                this.client.emit('get', {shape: shape.layers}, (res) => {
                    resolve(res.result)
                })   
            }else{
                resolve(false)
            }
        });
    }
}