import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-myotherstuff',
  imports: [NgFor],
  templateUrl: './myotherstuff.component.html',
  styleUrls: ['./myotherstuff.component.css']
})
export class MyotherstuffComponent {
  // Array de definición de columnas
  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'rol', label: 'Rol' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'salario', label: 'Salario' }
  ];

  // Array de datos
  rows: any[] = [
    { nombre: 'Ana García', rol: 'Desarrolladora Frontend', departamento: 'Ingeniería', salario: '$60,000' },
    { nombre: 'Luis Pérez', rol: 'Diseñador UX', departamento: 'Diseño', salario: '$55,000' },
    { nombre: 'Carlos López', rol: 'Project Manager', departamento: 'Operaciones', salario: '$75,000' },
    { nombre: 'Marta Sánchez', rol: 'Analista de Datos', departamento: 'Data', salario: '$68,000' }
  ];

  // Estado del Drag & Drop
  draggedRowIndex: number | null = null;
  draggedColIndex: number | null = null;
  dragType: 'row' | 'col' | null = null;
  dragOverRowIndex: number | null = null;
  dragOverColIndex: number | null = null;

  // --- EVENTOS DE FILAS ---
  onRowDragStart(index: number) {
    this.draggedRowIndex = index;
    this.dragType = 'row';
  }

  onRowDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.dragType === 'row' && this.draggedRowIndex !== index) {
      this.dragOverRowIndex = index;
    }
  }

  onRowDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.dragType === 'row' && this.draggedRowIndex !== null && this.draggedRowIndex !== index) {
      // Extraemos la fila de su posición original y la insertamos en la nueva
      const movedItem = this.rows.splice(this.draggedRowIndex, 1)[0];
      this.rows.splice(index, 0, movedItem);
    }
    this.resetDragState();
  }

  // --- EVENTOS DE COLUMNAS ---
  onColDragStart(index: number) {
    this.draggedColIndex = index;
    this.dragType = 'col';
  }

  onColDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.dragType === 'col' && this.draggedColIndex !== index) {
      this.dragOverColIndex = index;
    }
  }

  onColDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.dragType === 'col' && this.draggedColIndex !== null && this.draggedColIndex !== index) {
      // Extraemos la columna de su posición original y la insertamos en la nueva
      const movedCol = this.columns.splice(this.draggedColIndex, 1)[0];
      this.columns.splice(index, 0, movedCol);
    }
    this.resetDragState();
  }

  // Limpiar estados al soltar
  resetDragState() {
    this.draggedRowIndex = null;
    this.draggedColIndex = null;
    this.dragType = null;
    this.dragOverRowIndex = null;
    this.dragOverColIndex = null;
  }
}
