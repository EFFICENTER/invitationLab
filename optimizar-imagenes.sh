#!/bin/bash

echo "🖼️  Optimizando imágenes..."

# Contar imágenes originales
TOTAL=$(find assets/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | wc -l)
echo "Encontradas $TOTAL imágenes"

# Crear carpeta para optimizadas
mkdir -p assets/images-optimized

# Procesar JPG y JPEG
find assets/images -type f \( -name "*.jpg" -o -name "*.jpeg" \) -print0 | while IFS= read -r -d '' img; do
    filename=$(basename "$img")
    output="assets/images-optimized/${filename%.*}.webp"
    
    echo "📸 Convirtiendo: $filename → webp"
    
    # Convertir a WebP con 85% calidad (perfecto balance)
    magick "$img" -quality 85 -define webp:method=6 "$output"
done

# Procesar PNG
find assets/images -type f -name "*.png" -print0 | while IFS= read -r -d '' img; do
    filename=$(basename "$img")
    output="assets/images-optimized/${filename%.*}.webp"
    
    echo "📸 Convirtiendo: $filename → webp"
    
    # Convertir a WebP
    magick "$img" -quality 90 "$output"
done

echo ""
echo "✅ Optimización completa"
echo ""
echo "Tamaño antes:"
du -sh assets/images
echo ""
echo "Tamaño después:"
du -sh assets/images-optimized

