document.getElementById('subirFotoModal').addEventListener('shown.bs.modal', function () {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.dataset.listener) {
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const imagePreview = document.getElementById('imagePreview');
                const imageSpecs = document.getElementById('imageSpecs');
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    const img = new Image();
                    img.onload = function() {
                        document.getElementById('specDimensions').textContent = `Dimensiones: ${this.width} x ${this.height} píxeles`;
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
                document.getElementById('specName').textContent = `Nombre: ${file.name}`;
                document.getElementById('specSize').textContent = `Tamaño: ${(file.size / 1024).toFixed(2)} KB`;
                document.getElementById('specType').textContent = `Tipo: ${file.type}`;
                imageSpecs.style.display = 'block';
            }
        });
        fileInput.dataset.listener = "true";
    }
});

