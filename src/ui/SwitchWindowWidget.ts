import {uiShared} from "./uiShared";
import {buildWindow} from "./Window";
import {config} from "../configuration";

export function createSwitchWindowButton(): WidgetDesc {

    return {
        x: 0,
        y: 0,
        height: 10,
        width: 10,
        isChecked: config.getBoolean('tabs-as-columns'),
        name: "switch to tab button",
        onChange(isChecked: boolean): void {
            config.setBoolean('tabs-as-columns', isChecked)
            let window = ui.getWindow("Shop Price Manager")
            if (window != null) {
                window.close()
                context.setTimeout(buildWindow, 40)
            }
        },
        text: "",
        tooltip: 'toggle tab view',
        type: "checkbox"


    }
}

export function updateSwitchWindowButton(window: Window): void {
    let button = window.findWidget("switch to tab button")
    button.x = window.width - button.width - uiShared.padding - 10
}