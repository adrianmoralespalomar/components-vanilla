import { Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { SelectComponent } from '../../form-controls/select/select.component';
import { Row } from '../models/row.type';
import { FIRST_PAGE_SVG_ICON_PATH_DEFAULT, LAST_PAGE_SVG_ICON_PATH_DEFAULT, NEXT_PAGE_SVG_ICON_PATH_DEFAULT, PREVIOUS_PAGE_SVG_ICON_PATH_DEFAULT } from './constants/svg-icon-default.constant';
import { PaginationMeta } from './models/pagination-meta.interface';

@Component({
  selector: 'aesy-table-pagination',
  imports: [ButtonComponent, SelectComponent],
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.css']
})
export class TablePaginationComponent<T extends Row = Row> {
  readonly paginationMetaConfig = input.required<PaginationMeta>();
  readonly pageChanged = output<number>();
  readonly rowsPerPageChanged = output<number>();

  protected readonly getGoFirstPageIconSvgPath = computed(() => (this.paginationMetaConfig()?.goFirstPageButtonLabel ? null : (this.paginationMetaConfig().goFirstPageButtonIconSvg ?? FIRST_PAGE_SVG_ICON_PATH_DEFAULT)));
  protected readonly isFirstPageButtonDisabled = computed(() => this.paginationMetaConfig().page <= 1);

  protected readonly getPreviousPageIconSvgPath = computed(() => (this.paginationMetaConfig()?.previousLabel ? null : (this.paginationMetaConfig().previousIconSvg ?? PREVIOUS_PAGE_SVG_ICON_PATH_DEFAULT)));
  protected readonly isPreviousPageButtonDisabled = computed(() => this.paginationMetaConfig().page <= 1);

  protected readonly getNextPageIconSvgPath = computed(() => (this.paginationMetaConfig()?.nextLabel ? null : (this.paginationMetaConfig().nextIconSvg ?? NEXT_PAGE_SVG_ICON_PATH_DEFAULT)));
  protected readonly isNextPageButtonDisabled = computed(() => {
    return this.paginationMetaConfig().page * this.paginationMetaConfig().rowsPerPageCurrent >= this.paginationMetaConfig().total;
  });

  protected readonly getGoLastPageIconSvgPath = computed(() => (this.paginationMetaConfig()?.goLastPageButtonLabel ? null : (this.paginationMetaConfig().goLastPageButtonIconSvg ?? LAST_PAGE_SVG_ICON_PATH_DEFAULT)));
  protected readonly isLastPageButtonDisabled = computed(() => this.paginationMetaConfig().page * this.paginationMetaConfig().rowsPerPageCurrent >= this.paginationMetaConfig().total);

  protected changePageToFirst(): void {
    this.changePage(1);
  }

  protected changePageToPrevious(): void {
    this.changePage(this.paginationMetaConfig().page - 1);
  }

  protected changePageToNext(): void {
    this.changePage(this.paginationMetaConfig().page + 1);
  }

  protected changePageToLast(): void {
    const meta = this.paginationMetaConfig();
    const totalPages = Math.max(1, Math.ceil(meta.total / meta.rowsPerPageCurrent));
    this.changePage(totalPages);
  }

  private changePage(newPage: number): void {
    const meta = this.paginationMetaConfig();
    const totalPages = Math.max(1, Math.ceil(meta.total / meta.rowsPerPageCurrent));
    if (newPage < 1 || newPage > totalPages) return;
    return this.pageChanged.emit(newPage);
  }

  protected changeRowsPerPage(newRowsPerPage: number): void {
    this.rowsPerPageChanged.emit(newRowsPerPage);
  }
}
