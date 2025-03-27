document.addEventListener("DOMContentLoaded", () => {
    const shopContainer = document.getElementById("shop-container");

    if (!shopContainer) {
        console.error("Error: No se encontró el contenedor 'shop-container'.");
        return;
    }

    fetch("https://fortnite-api.com/v2/shop?language=es-419")
        .then(response => response.json())
        .then(data => {
            console.log("Datos de la API recibidos:", data);

            if (!data.data || !data.data.entries || data.data.entries.length === 0) {
                console.error("Error: No se encontraron datos.");
                shopContainer.innerHTML = "<p>Error al cargar la tienda. Inténtalo más tarde.</p>";
                return;
            }

            const itemsByCategory = {};

            data.data.entries.forEach(item => {
                let imageUrl = item.newDisplayAsset?.renderImages?.[0]?.image ||
                               item.bundle?.image ||
                               item.displayAsset?.image ||
                               item.albumArt ||
                               (item.brItems?.[0]?.images?.icon || "") ||
                               (item.cars?.[0]?.images?.large || item.cars?.[0]?.images?.small || "") ||
                               (item.tracks?.[0]?.albumArt || ""); 

                let rarity = item.brItems?.[0]?.rarity?.displayValue ||
                             item.cars?.[0]?.rarity?.displayValue ||
                             item.instruments?.[0]?.rarity?.displayValue ||
                             item.tracks?.[0]?.rarity?.displayValue ||
                             "Común";

                let rarityColor = getRarityColor(rarity);
                let vBucks = item.finalPrice;
                let soles = (vBucks / 100 * 1.80).toFixed(2);
                let timeLeft = getTimeLeft(item.outDate);
                let category = item.layout?.name || "Otros";

                let itemName = item.bundle?.name ||
                               item.brItems?.[0]?.name ||
                               item.instruments?.[0]?.name ||
                               item.tracks?.[0]?.title ||
                               item.cars?.[0]?.name ||
                               "SIN NOMBRE";

                // Si el objeto es Momentos Musicales o Pistas de Improvisación, asegurarse de obtener nombre e imagen
                if (category === "Momentos musicales" || category === "Pistas de improvisación") {
                    itemName = item.tracks?.[0]?.title || "SIN NOMBRE";
                    imageUrl = item.tracks?.[0]?.albumArt || "";
                }

                // Corrección para Rubius (Sonrisacha de MadKat)
                if (category === "Rubius" && item.instruments?.length > 0) {
                    itemName = item.instruments[0].name || "SIN NOMBRE";
                    imageUrl = item.instruments[0].images.large || item.instruments[0].images.small || "";
                }

                if (!itemsByCategory[category]) {
                    itemsByCategory[category] = [];
                }

                itemsByCategory[category].push(`
                    <div class="item" style="background-color: ${rarityColor};">
                        <div class="buy-icons">
                            <a href="https://wa.me/51917932301?text=${encodeURIComponent('¡Hola!\nEstoy interesado en comprar ' + itemName + '.\n\nCosto: ' + vBucks + ' pavos\nPrecio: S/ ' + soles + ' soles.\n\n¿Está disponible? ¿Cómo podemos coordinar?')}" target="_blank">
                                <img src="assets/whatsapp.png" alt="WhatsApp" class="buy-icon">
                            </a>
                            <a href="https://www.facebook.com/messages/t/564582056931570" target="_blank">
                                <img src="assets/facebook.png" alt="Facebook" class="buy-icon">
                            </a>
                            <a href="https://www.instagram.com/direct/t/107896800607394" target="_blank">
                                <img src="assets/instagram.png" alt="Instagram" class="buy-icon">
                            </a>
                            <a href="https://discord.com/invite/kidstore" target="_blank">
                                <img src="assets/discord.png" alt="Discord" class="buy-icon">
                            </a>
                        </div>
                        <img src="${imageUrl}" alt="${itemName}">
                        <div class="overlay">
                            <h3>${itemName}</h3>
                            <div class="price-container">
                                <img src="assets/pavos.png" class="pavos-icon">
                                <span>${vBucks}</span>
                            </div>
                            <p class="price-soles">S/ ${soles} Soles</p>
                            <p class="item-time">⏱️ ${timeLeft}</p>
                        </div>
                    </div>
                `);
            });

            // Ordenar categorías, dejando "Pistas de improvisación" al final
            const orderedCategories = Object.keys(itemsByCategory).sort((a, b) => {
                return a === "Pistas de improvisación" ? 1 : b === "Pistas de improvisación" ? -1 : 0;
            });

            shopContainer.innerHTML = orderedCategories
                .map(category => `
                    <h2 class="category-title">${category}</h2>
                    <div class="shop-container">${itemsByCategory[category].join("")}</div>
                `)
                .join("");
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
            shopContainer.innerHTML = "<p>Error al cargar la tienda. Inténtalo más tarde.</p>";
        });
});

// Función para obtener el color de rareza
function getRarityColor(rarity) {
    const colors = {
        "Común": "#B8B8B8",
        "Poco Común": "#00A859",
        "Raro": "#0086FF",
        "Épico": "#911EFF",
        "Legendario": "#FF8000",
        "Serie de ídolos": "#5cf2f3",
        "Serie de PUMA": "#813a95",
        "Serie de Marvel": "#ed1d24",
        "Serie de Festival": "#f4a400"
    };
    return colors[rarity] || "#00A859";
}

// Función para calcular el tiempo restante en días, horas y minutos
function getTimeLeft(outDate) {
    let endTime = new Date(outDate).getTime();
    let now = new Date().getTime();
    let diff = endTime - now;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
}

// Evento para cambiar de sección y mostrar productos
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".shop-container");
    const menuItems = document.querySelectorAll(".category-btn");

    // Función para cambiar de pestaña
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetSection = item.getAttribute("data-category");

            if (targetSection === "todos") {
                // Si es "Todos los objetos", mostramos todas las secciones
                sections.forEach(section => section.classList.add("active"));
            } else {
                // Ocultamos todas las secciones
                sections.forEach(section => section.classList.remove("active"));
                // Mostramos solo la sección seleccionada
                document.getElementById(targetSection).classList.add("active");
            }
        });
    });

    // Hacer que "Todos los Objetos" sea la primera sección visible al cargar la página
    sections.forEach(section => section.classList.add("active"));
});

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search-box");

    searchBox.addEventListener("input", () => {
        const searchTerm = searchBox.value.toLowerCase().trim();
        const allItems = document.querySelectorAll(".packs-item, .pavos-item, .pases-item, .pavos2-item, .item");
        const allTitles = document.querySelectorAll(".cosmeticos-title, .packs-title, .pavos-section-title, .pases-section-title, .pavos2-section-title, .category-title");
        const allSections = document.querySelectorAll(".shop-section");
        const allContainers = document.querySelectorAll(".shop-container, .packs-container, .pavos-container, .pases-container, .pavos2-container");

        let foundItems = 0;
        let firstVisibleItem = null;

        allItems.forEach(item => {
            const itemNameElement = item.querySelector("h3");
            const itemName = itemNameElement ? itemNameElement.innerText.toLowerCase() : "";

            if (itemName.includes(searchTerm)) {
                item.style.display = "flex";
                foundItems++;
                if (!firstVisibleItem) firstVisibleItem = item;
            } else {
                item.style.display = "none";
            }
        });

        // 🔥 Ocultar títulos de categorías si no hay productos visibles
        allTitles.forEach(title => {
            const section = title.nextElementSibling;
            if (section) {
                const visibleItems = section.querySelectorAll(".packs-item, .pavos-item, .pases-item, .pavos2-item, .item");
                const hasVisibleItems = Array.from(visibleItems).some(item => item.style.display !== "none");

                title.style.display = hasVisibleItems ? "block" : "none";

                if (hasVisibleItems && !firstVisibleItem) {
                    firstVisibleItem = title;
                }
            }
        });

        // 🔥 Asegurar que cada categoría y su título solo se muestren si tienen productos visibles
        function toggleCategoryVisibility(titleClass, containerClass, itemClass) {
            const titleElement = document.querySelector(titleClass);
            const containerElement = document.querySelector(containerClass);
            const items = document.querySelectorAll(itemClass);
            const hasVisibleItems = Array.from(items).some(item => item.style.display !== "none");

            if (titleElement) {
                titleElement.style.display = hasVisibleItems ? "block" : "none";
            }

            if (containerElement) {
                containerElement.style.display = hasVisibleItems ? "flex" : "none";
            }
        }

        toggleCategoryVisibility(".pavos-section-title", ".pavos-container", ".pavos-item");
        toggleCategoryVisibility(".pases-section-title", ".pases-container", ".pases-item");
        toggleCategoryVisibility(".packs-title", ".packs-container", ".packs-item");
        toggleCategoryVisibility(".pavos2-section-title", ".pavos2-container", ".pavos2-item");

        // 🔥 Ocultar completamente las secciones sin productos visibles
        allSections.forEach(section => {
            const visibleItems = section.querySelectorAll(".packs-item, .pavos-item, .pases-item, .pavos2-item, .item");
            const hasVisibleItems = Array.from(visibleItems).some(item => item.style.display !== "none");

            section.style.display = hasVisibleItems ? "block" : "none";
        });

        // 🔥 Ocultar completamente los contenedores sin productos visibles
        allContainers.forEach(container => {
            const visibleItems = container.querySelectorAll(".packs-item, .pavos-item, .pases-item, .pavos2-item, .item");
            const hasVisibleItems = Array.from(visibleItems).some(item => item.style.display !== "none");

            container.style.display = hasVisibleItems ? "flex" : "none";
        });

        // 🔥 Restaurar visibilidad de títulos y secciones si la búsqueda está vacía
        if (searchTerm === "") {
            allTitles.forEach(title => title.style.display = "block");
            allSections.forEach(section => section.style.display = section.classList.contains("active") ? "block" : "none");
            allContainers.forEach(container => container.style.display = "flex");
        }

        // 🔥 Ajustar el scroll para que los productos aparezcan justo debajo del buscador
        if (firstVisibleItem) {
            const offset = searchBox.getBoundingClientRect().top + window.scrollY + searchBox.offsetHeight + 20;
            window.scrollTo({
                top: offset,
                behavior: "smooth"
            });
        }
    });
});
