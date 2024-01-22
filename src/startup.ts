import {buildWindow} from "./ui/Window";
import {init_config} from "./configuration"
import {updateShopPrices} from "./manageShopPrices";


function onClickMenuItem() {
    if (typeof ui === "undefined") {
        return
    }
    buildWindow();
}

export function startup() {
    init_config()

    // Register a menu item under the map icon:
    if (typeof ui !== "undefined") {
        ui.registerMenuItem('Shop Price Manager', () => onClickMenuItem());
    }

    context.subscribe('interval.day', () => {
        if (context.mode == 'normal') updateShopPrices()
    })

    if (context.mode == 'normal')
        updateShopPrices()
}