export let uiShared = {
    ticksSinceLastUpdate: 0,
    ticksPerUpdate: 0,

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