import { globalConfig, THIRDPARTY_URLS } from "../../core/config";
import { DrawParameters } from "../../core/draw_parameters";
import { enumDirectionToVector } from "../../core/vector";
import { BaseItem } from "../base_item";
import { MinerComponent } from "../components/miner";
import { Entity } from "../entity";
import { GameSystemWithFilter } from "../game_system_with_filter";
import { MapChunkView } from "../map_chunk_view";
import { NetworkOutComponent } from "../components/networkOut";
import { ShapeItem } from "../items/shape_item";
import { ShapeDefinition, enumSubShape, ShapeLayer, ShapeLayerItem } from "../shape_definition";

export class NetworkOutSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [NetworkOutComponent]);
    }

    update() {
        let miningSpeed = this.root.hubGoals.getMinerBaseSpeed();
        if (G_IS_DEV && globalConfig.debug.instantMiners) {
            miningSpeed *= 100;
        }

        for (let i = 0; i < this.allEntities.length; ++i) {
            const entity = this.allEntities[i];
            const networkOutComp = entity.components.NetworkOut;

            // Reset everything on recompute
            /*if (this.needsRecompute) {
                minerComp.cachedChainedMiner = null;
            }*/

            // Check if miner is above an actual tile

            //console.log(minerComp)

            /*if (!networkOutComp.cachedMinedItem) {
                const staticComp = entity.components.StaticMapEntity;
                const tileBelow = this.root.map.getLowerLayerContentXY(
                    staticComp.origin.x,
                    staticComp.origin.y
                );
                if (!tileBelow) {
                    continue;
                }
                networkOutComp.cachedMinedItem = tileBelow;

            }

            //if (!networkOutComp.cachedMinedItem) {


                /* @type ShapeLayerItem *
                let corner = {subShape: enumSubShape.circle, color: "red"};
                /* @type ShapeLayerItem *
                let corner2 = {subShape: enumSubShape.rect, color: "blue"};
                /* @type ShapeLayer *
                let layer = [corner, corner2, corner, corner2];
                /* @type Array<ShapeLayer> *
                let layers = [layer]


                networkOutComp.cachedMinedItem = new ShapeItem(new ShapeDefinition({'layers': layers}));*/

            //}

            if(networkOutComp.cachedMinedItem && networkOutComp.cachedMinedItem instanceof ShapeItem){
                if(!this.lastTimeRejected || (this.root.time.now() - this.lastTimeRejected) >= 3){
                    this.root.systemMgr.systems.network.getShape(networkOutComp.cachedMinedItem.definition).then(result => {
                        if(!result){
                            this.lastTimeRejected = this.root.time.now();
                            return;
                        }
                        const mineDuration = 1 / miningSpeed;
                        const timeSinceMine = this.root.time.now() - networkOutComp.lastMiningTime;
                        if (timeSinceMine > mineDuration) {
                            // Store how much we overflowed
                            const buffer = Math.min(timeSinceMine - mineDuration, this.root.dynamicTickrate.deltaSeconds);
        
                            if (this.tryPerformMinerEject(entity, networkOutComp.cachedMinedItem)) {
                                // Analytics hook
                                this.root.signals.itemProduced.dispatch(networkOutComp.cachedMinedItem);
                                // Store mining time
                                networkOutComp.lastMiningTime = this.root.time.now() - buffer;
                            }
                        }
                    })
                }
            }
        }
    }

    /**
     *
     * @param {Entity} entity
     * @param {BaseItem} item
     */
    tryPerformMinerEject(entity, item) {
        const ejectComp = entity.components.ItemEjector;

        // Seems we are a regular miner or at the end of a row, try actually ejecting
        if (ejectComp.tryEject(0, item)) {
            return true;
        }

        return false;
    }

    /**
     * @param {DrawParameters} parameters
     */
    draw(parameters) {
        for (let i = 0; i < this.allEntities.length; ++i) {
            this.drawEntity(parameters, this.allEntities[i]);
        }
    }

    /**
     * @param {DrawParameters} parameters
     * @param {Entity} entity
     */
    drawEntity(parameters, entity) {
        const networkOutComp = entity.components.NetworkOut;
        const staticComp = entity.components.StaticMapEntity;
        if (!staticComp.shouldBeDrawn(parameters)) {
            return;
        }

        let value = networkOutComp.cachedMinedItem;

        const origin = entity.components.StaticMapEntity.origin;
        if (value.getItemType() === "color") {
            
        } else if (value.getItemType() === "shape") {
            value.drawItemCenteredClipped(
                (origin.x + 0.5) * globalConfig.tileSize,
                (origin.y + 0.5) * globalConfig.tileSize,
                parameters,
                globalConfig.tileSize/2
            );
        }
    }
}
