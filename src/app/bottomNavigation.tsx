"use client";
import { useRef, useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BottomTabProps, TabProps } from "./constants/model";
import Icon from "./Icon";
import ContextMenu from "./shared/ContextMenu";
import Modal from "./shared/Modal";

export default function BottomNavigation({ tabs, setTabs, activeId, setActiveId }: BottomTabProps) {

    const [draggableId, setDraggableId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newFormName, setNewFormName] = useState('');
    const [error, setError] = useState('');
    const additionalProps = useRef<{ nextTo?: number }>({});
    const draggedTab = tabs.find(t => t.id === draggableId);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5,
        },
    }));

    const handleDragStart = (event: DragStartEvent) => setDraggableId(event.active.id as string);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id && over) {
            const oldIndex = tabs.findIndex(t => t.id === active.id);
            const newIndex = tabs.findIndex(t => t.id === over.id);
            setTabs(arrayMove(tabs, oldIndex, newIndex));
        }
        setDraggableId(null);
    };

    const handleAddButton = (nextToIndex?: number) => {
        additionalProps.current.nextTo = nextToIndex;
        setIsDialogOpen(true);
    };

    const onAddNewForm = () => {
        const trimmedName = newFormName.trim();
        if (!trimmedName || tabs.some(tab => tab.name.toLowerCase() === trimmedName.toLowerCase())) return;

        const newTabs = [...tabs];
        newTabs.splice(((additionalProps.current.nextTo) ?? newTabs.length - 1) + 1, 0, {
            id: newFormName,
            name: newFormName,
            icon: 'file'
        });
        setTabs(newTabs);
        setIsDialogOpen(false);
        additionalProps.current.nextTo = undefined;
        setNewFormName('');
    };

    // Inside BottomNavigation, add these states:
    const [contextMenuTabId, setContextMenuTabId] = useState<number | null>(null);
    const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

    // Function to open context menu near the kebab icon
    const openContextMenu = (event: React.MouseEvent, index: number) => {
        event.preventDefault();
        event.stopPropagation(); // stop event bubbling (avoid triggering other clicks)

        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setContextMenuTabId(index);
        // position the menu slightly below and to the right of the icon
        setContextMenuPos({ x: rect.right - 4, y: rect.top });
    };
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={tabs.map(tab => tab.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex bg-white h-12 items-center overflow-auto">
                    {tabs.map((tab, index) => (
                        <div key={tab.id} className="flex items-center">
                            <SortableTab
                                tab={tab}
                                isActive={activeId === tab.id}
                                onSelect={() => setActiveId(tab.id)}
                                onOpenContextMenu={(e) => openContextMenu(e, index)}
                            />
                            <div className={`relative flex flex-row ${index !== tabs.length - 1 ? 'cursor-pointer' : ''} p-1 items-center group`}>
                                <div className="h-0 w-8 border-dashed border-[#C0C0C0] border" />
                                {index !== tabs.length - 1 && (
                                    <div
                                        onClick={() => handleAddButton(index)}
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-4 h-4 rounded-full border border-[var(--border-color)] shadow transition-all duration-200 ease-out scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 bg-white z-10 hover:bg-gray-100"
                                    >
                                        <Icon iconName="plus" stroke="var(--text-color-active)" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div
                        onClick={() => handleAddButton()}
                        className="flex cursor-pointer items-center gap-2 ml-1 rounded-md px-[10px] py-[4px] bg-white text-[var(--text-color-active)] border border-[var(--border-color)] whitespace-pre hover:bg-gray-100 transition"
                    >
                        <Icon iconName="plus" stroke="var(--text-color-active)" width="12" height="12" />
                        Add Page
                    </div>
                </div>
            </SortableContext>

            <Modal
                isOpen={isDialogOpen}
                onClose={() => {
                    setNewFormName('');
                    setIsDialogOpen(false);
                    setError('');
                }}
                title={
                    <div className="flex gap-2 items-center">
                        <Icon iconName={'file'} fill={'var(--active-icon-color)'} />
                        <h4>Name of your Form Page</h4>
                    </div>
                }
                footer={
                    <div className="flex justify-end gap-2">
                        <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-[#0096FF] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={!newFormName || newFormName.length === 0 || error.length !== 0}
                            onClick={onAddNewForm}
                        >
                            Continue
                        </button>
                    </div>
                }
            >
                <input
                    name="formName"
                    placeholder="Form Name"
                    type="text"
                    value={newFormName}
                    onChange={(event) => {
                        const value = event.target.value;
                        setNewFormName(value);
                        if (tabs.some(t => t.name.toLowerCase() === value.trim().toLowerCase())) {
                            setError('A tab with this name already exists.');
                        } else {
                            setError('');
                        }
                    }}
                    className={`w-full p-2 rounded border outline-none 
        ${error ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}
    `}
                />
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </Modal>

            <DragOverlay>
                {draggableId && draggedTab ? (
                    <div className="flex items-center gap-2 rounded-md px-2 py-1 bg-[var(--bg-focus)] text-[var(--text-color-default)] border border-[#2F72E2]">
                        <Icon
                            iconName={draggedTab.icon}
                            strokeColor={'var(--active-icon-color)'}
                            fill="var(--active-icon-color)" />
                        {draggedTab.name}
                        <button
                            aria-label="Open context menu"
                            className={`rounded hover:bg-gray-200 focus:outline-none  invisible`}
                            type="button"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                            </svg>
                        </button>
                    </div>
                ) : null}
            </DragOverlay>

            {contextMenuPos && <ContextMenu
                position={contextMenuPos}
                onClose={() => {
                    setContextMenuTabId(null);
                    setContextMenuPos(null);
                }}
                items={[
                    ...(contextMenuTabId !== 0 ? [{
                        label: <div className="flex flex-row gap-2">
                            <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.19702 9.48968C3.80363 9.10058 2.55415 8.80158 1.16666 9.37702V13.1664C1.16666 13.4425 0.942799 13.6664 0.666656 13.6664C0.390514 13.6664 0.166656 13.4425 0.166656 13.1664V1.93248C0.166656 1.49723 0.414411 1.062 0.861621 0.884636C2.51915 0.227256 4.00994 0.585905 5.34893 0.956919C5.43675 0.981251 5.5238 1.00557 5.61016 1.0297C6.87557 1.38323 7.99341 1.69554 9.20948 1.40086C9.92454 1.22758 10.8333 1.69562 10.8333 2.59117V8.64105C10.8333 9.0763 10.5856 9.51153 10.1384 9.68889C8.3824 10.3853 6.80248 9.94102 5.39759 9.54595C5.33033 9.52703 5.26347 9.50823 5.19702 9.48968Z" fill="#2F72E2" />
                            </svg>
                            Set as first page
                        </div>,
                        onClick: () => {
                            alert(`Set as first page`);
                        },
                    }] : []),
                    {
                        label: <div className="flex flex-row gap-2">
                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.01334 13.1667H13.6667M1.33334 10.6213V13.1667H3.87873C4.05473 13.1667 4.22351 13.0968 4.34796 12.9723L13.4723 3.84795C13.7315 3.5888 13.7315 3.16864 13.4723 2.90949L11.5905 1.02769C11.3314 0.768547 10.9112 0.768547 10.6521 1.02769L1.5277 10.1521C1.40326 10.2765 1.33334 10.4453 1.33334 10.6213Z" stroke="#9DA4B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Rename
                        </div>,
                        onClick: () => {
                            alert(`Rename tab`);
                        },
                    },
                    {
                        label: <div className="flex flex-row gap-2">
                            <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.66666 2.16667H10.6667C11.0348 2.16667 11.3333 2.46514 11.3333 2.83333V12.5C11.3333 12.8682 11.0348 13.1667 10.6667 13.1667H2.33332C1.96513 13.1667 1.66666 12.8682 1.66666 12.5V2.83333C1.66666 2.46514 1.96513 2.16667 2.33332 2.16667H4.33332M4.99999 3.83333H7.99999C8.36818 3.83333 8.66666 3.53486 8.66666 3.16667V1.5C8.66666 1.13181 8.36818 0.833334 7.99999 0.833334H4.99999C4.6318 0.833334 4.33332 1.13181 4.33332 1.5V3.16667C4.33332 3.53486 4.6318 3.83333 4.99999 3.83333Z" stroke="#9DA4B2" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" />
                            </svg>
                            Copy
                        </div>,
                        onClick: () => {
                            alert(`Copy tab`);
                        },
                    },
                    {
                        label: <div className="flex flex-row gap-2">
                            <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.66667 4.16667V2.16667C3.66667 1.79848 3.96514 1.5 4.33333 1.5H11.3333C11.7015 1.5 12 1.79848 12 2.16667V9.17333C12 9.54152 11.7015 9.84 11.3333 9.84H9.33333M1 4.83333V11.8333C1 12.2015 1.29848 12.5 1.66667 12.5H8.66667C9.03486 12.5 9.33333 12.2015 9.33333 11.8333V4.83333C9.33333 4.46514 9.03486 4.16667 8.66667 4.16667H1.66667C1.29848 4.16667 1 4.46514 1 4.83333Z" stroke="#9DA4B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Duplicate
                        </div>,
                        onClick: () => {
                            alert(`Duplicate tab`);
                        },
                    },
                    {
                        label: <div className="flex flex-row gap-2 ">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.2931 13.0429L2.54466 13.0912L3.2931 13.0429ZM11.7069 13.0429L12.4554 13.0912V13.0912L11.7069 13.0429ZM1.33334 2.58334C0.91913 2.58334 0.583344 2.91912 0.583344 3.33334C0.583344 3.74755 0.91913 4.08334 1.33334 4.08334V2.58334ZM13.6667 4.08334C14.0809 4.08334 14.4167 3.74755 14.4167 3.33334C14.4167 2.91912 14.0809 2.58334 13.6667 2.58334V4.08334ZM6.75001 6.66667C6.75001 6.25246 6.41422 5.91667 6.00001 5.91667C5.5858 5.91667 5.25001 6.25246 5.25001 6.66667H6.75001ZM5.25001 10.3333C5.25001 10.7476 5.5858 11.0833 6.00001 11.0833C6.41422 11.0833 6.75001 10.7476 6.75001 10.3333H5.25001ZM9.75001 6.66667C9.75001 6.25246 9.41422 5.91667 9.00001 5.91667C8.5858 5.91667 8.25001 6.25246 8.25001 6.66667H9.75001ZM8.25001 10.3333C8.25001 10.7476 8.5858 11.0833 9.00001 11.0833C9.41422 11.0833 9.75001 10.7476 9.75001 10.3333H8.25001ZM9.35635 3.52028C9.4596 3.92142 9.86848 4.16291 10.2696 4.05966C10.6708 3.95642 10.9123 3.54753 10.809 3.14639L9.35635 3.52028ZM2.66668 3.33334L1.91823 3.38162L2.54466 13.0912L3.2931 13.0429L4.04155 12.9946L3.41512 3.28505L2.66668 3.33334ZM3.95839 13.6667V14.4167H11.0416V13.6667V12.9167H3.95839V13.6667ZM11.7069 13.0429L12.4554 13.0912L13.0818 3.38162L12.3333 3.33334L11.5849 3.28505L10.9585 12.9946L11.7069 13.0429ZM12.3333 3.33334V2.58334H2.66668V3.33334V4.08334H12.3333V3.33334ZM1.33334 3.33334V4.08334H2.66668V3.33334V2.58334H1.33334V3.33334ZM12.3333 3.33334V4.08334H13.6667V3.33334V2.58334H12.3333V3.33334ZM11.0416 13.6667V14.4167C11.7886 14.4167 12.4073 13.8367 12.4554 13.0912L11.7069 13.0429L10.9585 12.9946C10.9613 12.9508 10.9977 12.9167 11.0416 12.9167V13.6667ZM3.2931 13.0429L2.54466 13.0912C2.59275 13.8367 3.21139 14.4167 3.95839 14.4167V13.6667V12.9167C4.00233 12.9167 4.03872 12.9508 4.04155 12.9946L3.2931 13.0429ZM6.00001 6.66667H5.25001V10.3333H6.00001H6.75001V6.66667H6.00001ZM9.00001 6.66667H8.25001V10.3333H9.00001H9.75001V6.66667H9.00001ZM7.50002 1.33334V2.08334C8.39209 2.08334 9.14354 2.69345 9.35635 3.52028L10.0827 3.33334L10.809 3.14639C10.4298 1.67292 9.09308 0.583336 7.50002 0.583336V1.33334ZM4.91737 3.33334L5.6437 3.52028C5.85651 2.69345 6.60796 2.08334 7.50002 2.08334V1.33334V0.583336C5.90697 0.583336 4.57029 1.67292 4.19104 3.14639L4.91737 3.33334Z" fill="#EF494F" />
                            </svg>
                            Delete
                        </div>,
                        onClick: () => {
                            alert(`Delete tab`);
                        },
                        className: "text-red-500 border-t border-red-200",
                    },
                ]}
            />}

        </DndContext>
    );
}

function SortableTab({ tab, isActive, onSelect, onOpenContextMenu }: TabProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tab.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            return;
        }
        onSelect();
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            onClick={handleClick}
            className={`z-1 flex items-center gap-2 rounded-md px-2 py-1 transition
                ${isActive
                    ? 'bg-[var(--bg-active)] text-[var(--text-color-active)] border border-[var(--border-color)]'
                    : 'bg-[var(--bg-default)] text-[var(--text-color-default)] hover:bg-[var(--bg-hover)]'}
            `}
        >
            <Icon
                iconName={tab.icon}
                {...(isActive
                    ? { strokeColor: 'var(--active-icon-color)', fill: 'var(--active-icon-color)' }
                    : {})}
            />
            {tab.name}
            <button
                aria-label="Open context menu"
                onClick={(e) => onOpenContextMenu(e)}
                className={`rounded hover:bg-gray-200 focus:outline-none ${isActive && !isDragging ? 'visible' : 'invisible'} `}
                type="button"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                </svg>
            </button>
        </div>
    );
}
