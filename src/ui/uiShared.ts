interface UiConstants {
    ticksSinceLastUpdate: number,
    ticksPerUpdate: number,

    windowHeaderHeight: number,
    tabIconHeight: number,
    padding: number,
    getTopY(): number,

    tabsAsColumns: true,

    updateOnNextTick(): void,

    currentShopItemPriceVersion: number
}
export let uiShared: UiConstants = {
    ticksSinceLastUpdate: 0,
    ticksPerUpdate: 40,

    windowHeaderHeight: 15,
    tabIconHeight: 28,
    padding: 5,
    getTopY(): number {
      return this.windowHeaderHeight + this.tabIconHeight + this.padding
    },

    tabsAsColumns: true,

    updateOnNextTick(): void{
        this.ticksSinceLastUpdate = this.ticksPerUpdate
    },

    currentShopItemPriceVersion: -1
}