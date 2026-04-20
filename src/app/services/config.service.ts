import { Injectable, computed, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fetchAndActivate, getBoolean, RemoteConfig } from '@angular/fire/remote-config';
import { interval } from 'rxjs';

/**
 * Servicio para gestión de Firebase Remote Config.
 * Controla feature flags como la visibilidad del sistema de categorías.
 * Realiza polling cada 30 segundos con cleanup automático vía DestroyRef.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {

  private readonly remoteConfig = inject(RemoteConfig);
  private readonly destroyRef = inject(DestroyRef);
  private readonly showCategoriesFlag = signal<boolean>(true);
  private readonly isLoading = signal<boolean>(true);
  private readonly hasError = signal<boolean>(false);

  constructor() {
    this.listenToFlagChanges();
  }

  /** Señal pública: ¿mostrar sistema de categorías? */
  readonly showCategories = computed(() => this.showCategoriesFlag());

  /** Señal pública: ¿está cargando la configuración? */
  readonly loading = computed(() => this.isLoading());

  /** Señal pública: ¿hubo error al obtener la configuración? */
  readonly error = computed(() => this.hasError());

  /**
   * Obtiene y activa la configuración remota.
   * Incluye manejo de errores para evitar que la app falle si Firebase no está disponible.
   */
  private async fetchFlag(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
      const value = getBoolean(this.remoteConfig, 'showCategories');
      this.showCategoriesFlag.set(value);
      this.hasError.set(false);
    } catch (error) {
      console.warn('Remote Config fetch failed, using default value:', error);
      this.hasError.set(true);
      // En caso de error, mantener el valor por defecto (true)
      // para no bloquear funcionalidad
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Inicia el polling periódico para verificar cambios en Remote Config.
   * Usa takeUntilDestroyed para limpieza automática de la suscripción.
   */
  private listenToFlagChanges(): void {
    // Polling cada 30 segundos
    interval(30000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchFlag());

    // Carga inmediata la primera vez
    this.fetchFlag();
  }
}
