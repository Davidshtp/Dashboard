import { create } from "zustand";
import { categoryService } from "../services/categoryService";

export interface Category {
  id: string;
  name: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryState>()(
  (set) => ({
    categories: [],
    loading: false,
    error: null,

    // Obtener todas las categorías desde el backend
    fetchCategories: async () => {
      set({ loading: true, error: null });
      try {
        const data = await categoryService.getAll();
        set({ categories: data, loading: false });
      } catch (error: any) {
        const errorMsg = error?.detail || "Error al obtener categorías";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    // Crear categoría
    addCategory: async (name) => {
      set({ loading: true, error: null });
      try {
        const newCategory = await categoryService.create(name);
        set((state) => ({
          categories: [...state.categories, newCategory],
          loading: false,
        }));
      } catch (error: any) {
        const errorMsg = error?.detail || "Error al crear categoría";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    // Actualizar categoría
    updateCategory: async (id, name) => {
      set({ loading: true, error: null });
      try {
        const updatedCategory = await categoryService.update(id, name);
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? updatedCategory : cat
          ),
          loading: false,
        }));
      } catch (error: any) {
        const errorMsg = error?.detail || "Error al actualizar categoría";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    // Eliminar categoría
    deleteCategory: async (id) => {
      set({ loading: true, error: null });
      try {
        await categoryService.delete(id);
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          loading: false,
        }));
      } catch (error: any) {
        const errorMsg = error?.detail || "Error al eliminar categoría";
        set({ error: errorMsg, loading: false });
        throw error;
      }
    },

    // Establecer categorías manualmente
    setCategories: (categories) => set({ categories }),
  })
);
