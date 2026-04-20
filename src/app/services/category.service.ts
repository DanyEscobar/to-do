import { Injectable, signal, computed } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Category, CATEGORY_COLORS } from '../interfaces/category.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio para gestión CRUD de categorías.
 * Usa señales (signals) para estado reactivo y @capacitor/preferences para persistencia.
 */
@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly STORAGE_KEY = 'categories';
  private readonly categories = signal<Category[]>([]);

  /** Categorías por defecto que se crean en la primera ejecución */
  private readonly defaultCategories: Omit<Category, 'id' | 'createdAt'>[] = [
    { name: 'Personal', color: '#6366f1', icon: 'person-outline' },
    { name: 'Trabajo', color: '#06b6d4', icon: 'briefcase-outline' },
    { name: 'Urgente', color: '#ef4444', icon: 'alert-circle-outline' },
    { name: 'Compras', color: '#10b981', icon: 'cart-outline' },
  ];

  /** Señal computada pública con la lista de categorías */
  readonly allCategories = computed(() => this.categories());

  /**
   * Carga las categorías desde el almacenamiento local.
   * Si no existen, crea las categorías por defecto.
   */
  async loadCategories(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      const parsed = value ? JSON.parse(value) : null;

      if (parsed !== null && Array.isArray(parsed)) {
        // Puede ser un array vacío si el usuario borró todo
        this.categories.set(parsed);
      } else {
        // Solo inicializar si es la primera vez que se abre la app
        await this.initDefaults();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      await this.initDefaults();
    }
  }

  /** Inicializa categorías por defecto */
  private async initDefaults(): Promise<void> {
    const defaults: Category[] = this.defaultCategories.map(cat => ({
      ...cat,
      id: uuidv4(),
      createdAt: Date.now(),
    }));
    this.categories.set(defaults);
    await this.saveCategories();
  }

  /** Persiste las categorías en almacenamiento local */
  private async saveCategories(): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(this.categories()),
    });
  }

  /** Obtiene una categoría por su ID */
  getCategoryById(id: string): Category | undefined {
    return this.categories().find(c => c.id === id);
  }

  /** Obtiene el nombre de una categoría por su ID */
  getCategoryName(id: string): string {
    return this.getCategoryById(id)?.name ?? '';
  }

  /** Obtiene el color de una categoría por su ID */
  getCategoryColor(id: string): string {
    return this.getCategoryById(id)?.color ?? '#94a3b8';
  }

  /** Agrega una nueva categoría */
  async addCategory(name: string, color: string, icon?: string): Promise<Category> {
    const newCategory: Category = {
      id: uuidv4(),
      name: name.trim(),
      color,
      icon,
      createdAt: Date.now(),
    };

    this.categories.update(cats => [...cats, newCategory]);
    await this.saveCategories();
    return newCategory;
  }

  /** Actualiza una categoría existente */
  async updateCategory(id: string, name: string, color: string, icon?: string): Promise<void> {
    this.categories.update(cats =>
      cats.map(c => c.id === id ? { ...c, name: name.trim(), color, icon } : c)
    );
    await this.saveCategories();
  }

  /** Elimina una categoría por su ID */
  async deleteCategory(id: string): Promise<void> {
    this.categories.update(cats => cats.filter(c => c.id !== id));
    await this.saveCategories();
  }

  /** Verifica si un nombre de categoría ya existe (case insensitive) */
  categoryExists(name: string, excludeId?: string): boolean {
    return this.categories().some(
      c => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== excludeId
    );
  }

  /** Obtiene los colores disponibles para categorías */
  getAvailableColors(): string[] {
    return CATEGORY_COLORS;
  }
}
