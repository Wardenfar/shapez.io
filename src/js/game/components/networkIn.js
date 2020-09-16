import { BaseItem } from "../base_item";
import { Component } from "../component";

export class NetworkInComponent extends Component {
    static getId() {
        return "NetworkIn";
    }

    static getSchema() {
        return {};
    }

    duplicateWithoutContents() {
        return new NetworkInComponent();
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
        
    }
}
