import { types } from "../../savegame/serialization";
import { BaseItem } from "../base_item";
import { Component } from "../component";
import { Entity } from "../entity";
import { typeItemSingleton } from "../item_resolver";

const chainBufferSize = 6;

export class NetworkOutComponent extends Component {
    static getId() {
        return "NetworkOut";
    }

    static getSchema() {
        // cachedMinedItem is not serialized.
        return {
            lastMiningTime: types.ufloat,
            itemChainBuffer: types.array(typeItemSingleton),
            cachedMinedItem: types.nullable(typeItemSingleton),
        };
    }

    duplicateWithoutContents() {
        return new NetworkOutComponent({
            chainable: this.chainable,
        });
    }

    constructor({ chainable = false }) {
        super();
        this.lastMiningTime = 0;
        this.chainable = chainable;

        /**
         * Stores items from other miners which were chained to this
         * miner.
         * @type {Array<BaseItem>}
         */
        this.itemChainBuffer = [];

        /**
         * @type {BaseItem}
         */
        this.cachedMinedItem = null;

        /**
         * Which miner this miner ejects to, in case its a chainable one.
         * If the value is false, it means there is no entity, and we don't have to re-check
         * @type {Entity|null|false}
         */
        this.cachedChainedMiner = null;
    }


    
    /**
     * Returns whether this storage can accept the item
     * @param {BaseItem} item
     */
    canAcceptItem(item) {
        return true;
    }

    /**
     * @param {BaseItem} item
     */
    takeItem(item) {
        this.cachedMinedItem = item;
    }
}
