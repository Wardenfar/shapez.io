import { enumDirection, Vector } from "../../core/vector";
import { ItemEjectorComponent } from "../components/item_ejector";
import { ItemAcceptorComponent } from "../components/item_acceptor";
import { MinerComponent } from "../components/miner";
import { Entity } from "../entity";
import { MetaBuilding } from "../meta_building";
import { GameRoot } from "../root";
import { T } from "../../translations";
import { formatItemsPerSecond } from "../../core/utils";
import { NetworkOutComponent } from "../components/networkOut";

const overlayMatrix = [1, 1, 1, 1, 0, 1, 1, 1, 1];

export class MetaNetworkOutBuilding extends MetaBuilding {

    constructor() {
        super("network_out");
    }

    getSilhouetteColor() {
        return "#FF0000";
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        const speed = root.hubGoals.getMinerBaseSpeed();
        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
    }

    /**
     *
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        /*if (root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_miner_chainable)) {
            return [defaultBuildingVariant, enumMinerVariants.chainable];
        }*/
        return super.getAvailableVariants(root);
    }

    /**
     * @param {number} rotation
     * @param {number} rotationVariant
     * @param {string} variant
     * @param {Entity} entity
     */
    getSpecialOverlayRenderMatrix(rotation, rotationVariant, variant, entity) {
        return overlayMatrix;
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(new NetworkOutComponent({}));
        entity.addComponent(
            new ItemEjectorComponent({
                slots: [{ pos: new Vector(0, 0), direction: enumDirection.top }],
            })
        );
        
        entity.addComponent(
            new ItemAcceptorComponent({
                slots: [{ 
                    pos: new Vector(0, 0), 
                    directions: [enumDirection.bottom], 
                    filter: "shape"
                }],
            }
        ))
    }
}
