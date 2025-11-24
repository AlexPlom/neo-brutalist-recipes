import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CountryService {
    readonly selectedCountry = signal<string>('BG');

    toggleCountry(): void {
        this.selectedCountry.update((current) => (current === 'BG' ? 'GR' : 'BG'));
    }

    setCountry(country: string): void {
        this.selectedCountry.set(country);
    }
}
