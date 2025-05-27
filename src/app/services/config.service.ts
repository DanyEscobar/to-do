import { Injectable, computed, inject, signal } from '@angular/core';
import { fetchAndActivate, getBoolean, RemoteConfig } from '@angular/fire/remote-config';
import { interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly remoteConfig = inject(RemoteConfig);
  private readonly showCategoriesFlag = signal<boolean>(false);

  constructor() {
    this.listenToFlagChanges();
  }

  // Exponer como señal pública
  showCategories = computed(() => this.showCategoriesFlag());

  private async fetchFlag() {
    await fetchAndActivate(this.remoteConfig);
    const value = getBoolean(this.remoteConfig, 'showCategories');
    this.showCategoriesFlag.set(value);
  }

  private listenToFlagChanges(): void {
    // Escuchar cada 30 segundos (puedes ajustar el tiempo)
    interval(30000).subscribe(() => this.fetchFlag());

    // Cargar de inmediato la primera vez
    this.fetchFlag();
  }
}
