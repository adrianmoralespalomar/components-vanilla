Para cambiar las variables css de estos controles.
Si estan dentro de la carpeta "theme", estaran en :root asi que podemos cambiarlo sin problema en cualquier lugar

# Ejemplo

div.aesy-table-th-filter {
--aesy-form-controls-height: 2rem;
}
Aqui --aesy-form-controls-height: 2rem; esta dentro del root, asi q se cambia en este caso y listo.

En el caso de que queramos cambiar una variable host de un componente, como estos se copian en el overlay del componente (funcion copyCssVariablesToOverlay), lo que tendremos que hacer es especificar sobre el app-select o cualquiera y ya dentro lo podremos cambiar.

# Ejemplo

div.aesy-table-th-filter {
app-select {
--aesy-select-dropdown-option-height: 1rem;
}
--aesy-form-controls-height: 2rem;
}
Si pusieramos --aesy-select-dropdown-option-height: 1rem; fuera del app-select, no surgiria efecto.
Si ya quisieramos tocar algo mas, tendriamos que hacer ::ng-deep y tocar.
