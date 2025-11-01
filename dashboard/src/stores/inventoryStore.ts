// src/stores/inventoryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface InventoryState {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: [], // Estado inicial

      // Acción para agregar
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }));
      },

      // Acción para actualizar
      updateItem: (updatedItem) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        }));
      },

      // Acción para eliminar
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
    }),
    {
      name: "inventory-storage", // Clave en LocalStorage
    }
  )
);