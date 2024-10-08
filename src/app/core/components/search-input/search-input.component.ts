import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent<T> {
  @Input() items: T[] = [];
  @Input() searchProperty: (item: T) => string = () => '';
  @Output() filteredItemsChange = new EventEmitter<T[]>();
  searchQuery = '';

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
    this.filterItems(query);
  }

  private filterItems(query: string): void {
    if (!query) {
      this.filteredItemsChange.emit(this.items);
    } else {
      const filtered = this.items.filter(item =>
        this.searchProperty(item).toLowerCase().includes(query.toLowerCase())
      );
      this.filteredItemsChange.emit(filtered);
    }
  }
}
