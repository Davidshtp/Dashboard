import { create } from "zustand";
import { itemService } from "../services/itemService";

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  categoryId: string;
}

interface InventoryState {
  items: Item[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<Item, 'id'>) => Promise<void>;
  updateItem: (id: string, item: Omit<Item, 'id'>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setItems: (items: Item[]) => void;
}

export const useInventoryStore = create<InventoryState>()(
  (set) => ({
    items: [],
    loading: false,
    error: null,

    // Obtener todos los items desde el backend
    fetchItems: async () => {
      set({ loading: true, error: null });
      try {
        const data = await itemService.getAll();
        set({ items: data, loading: false });
      } catch (error: any) {
        const errorMsg = error?.detail || "Error al obtener productos";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    // Agregar nuevo item
    addItem: async (item) => {
      set({ loading: true, error: null });
      try {
        const newItem = await itemService.create(item);
        set((state) => ({
          items: [...state.items, newItem],
          loading: false,
        }));
      } catch (error: any) {
        const errorMsg = error?.detail || "Error al crear producto";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    // Actualizar item
    updateItem: async (id, item) => {
      set({ loading: true, error: null });
      try {
        const updatedItem = await itemService.update(id, item);
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? updatedItem : i
          ),
          loading: false,
        }));
      } catch (error: any) {
        const errorMsg = error?.detail || "Error al actualizar producto";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    // Eliminar item
    deleteItem: async (id) => {
      set({ loading: true, error: null });
      try {
        await itemService.delete(id);
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          loading: false,
        }));
      } catch (error: any) {
        const errorMsg = error?.detail || "Error al eliminar producto";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    // Establecer items manualmente
    setItems: (items) => set({ items }),
  })
);