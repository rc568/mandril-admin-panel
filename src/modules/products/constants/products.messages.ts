export const messages = {
  PRODUCT_CREATED: 'Producto creado exitosamente.',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente.',
  PRODUCT_NOT_MODIFIED: 'No se han realizado modificaciones en el producto.',
  VALIDATION: {
    SLUG_FORMAT: 'El slug solo puede contener letras minúsculas, números y guiones.',
    DUPLICATE_PRODUCT_ATTRIBUTES: 'No puedes repetir atributos del producto.',
    ATTRIBUTES_REQUIRED_FOR_MULTIPLE_VARIANTS: 'Selecciona atributos para registrar más de una variante.',
    MINIMUM_VARIANTS_WITH_ATTRIBUTES: 'Un producto con atributos debe tener al menos dos variantes.',
    ALL_VARIANT_ATTRIBUTES_REQUIRED: 'Completa un valor para cada atributo seleccionado en todas las variantes.',
    DUPLICATE_VARIANT_COMBINATION: 'No puedes crear dos variantes con la misma combinación de atributos.',
    INCONSISTENT_VARIANT_ATTRIBUTES: 'Los atributos de la variante no son consistentes o están duplicados.',
    DUPLICATE_VARIANTS: 'Existen variantes duplicadas en la petición.'
  }
} as const;
