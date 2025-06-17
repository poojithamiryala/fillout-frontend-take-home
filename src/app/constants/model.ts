
export interface TabProps {
    tab: TabData,
    isActive: boolean,
    onSelect: () => void,
    onOpenContextMenu: (e: any, id: TabData['id']) => void
}
export type IconName = 'file' | 'infoClock' | 'plus' | 'checkCircle';

export interface TabData {
    id: string,
    name: string,
    icon: IconName,
}

export interface BottomTabProps {
    tabs: TabData[],
    setTabs: (ele: TabData[]) => void,
    activeId: TabData['id'],
    setActiveId: (ele: TabData['id']) => void,
}