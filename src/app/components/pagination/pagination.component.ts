// src/app/components/pagination/pagination.component.ts
import { Component, input, output, computed,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();
  contentService = inject(ContentService); 
  
  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];
    
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);
    
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      }
      if (end === total) {
        start = Math.max(1, end - 4);
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}