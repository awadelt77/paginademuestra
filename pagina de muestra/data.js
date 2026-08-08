const productos = [
  {
    img: "img/Samsung-Galaxy-S25-Ultra_Yoast-image-packshot-review-Recovered.webp",
    nombre: "Smartphone Galaxy Pro",
    marca: "Samsung",
    precio: 3500000,
    reco: true,
    specs: [
      ["Pantalla", "6.7\" AMOLED, 120 Hz"],
      ["Cámara", "Triple 108 MP + 12 MP + 5 MP"],
      ["Batería", "5000 mAh con carga rápida 45 W"],
      ["Almacenamiento", "256 GB"],
      ["RAM", "12 GB"],
      ["Conectividad", "5G, WiFi 6, Bluetooth 5.3"]
    ]
  },
  {
    img: "img/33caccc7-c50f-4553-bc4a-0bca50a4099b.webp",
    nombre: "Laptop UltraBook 14",
    marca: "Lenovo",
    precio: 4800000,
    specs: [
      ["Procesador", "Intel Core i7 de 13ª generación"],
      ["RAM", "16 GB DDR5"],
      ["Almacenamiento", "SSD NVMe 1 TB"],
      ["Pantalla", "14\" QHD+, 100% sRGB"],
      ["Batería", "Hasta 15 horas"],
      ["Peso", "1.2 kg"]
    ]
  },
  {
    img: "img/WHCH520BZ_Sony_Web_003.webp",
    nombre: "Auriculares NoiseFree",
    marca: "Sony",
    precio: 1200000,
    reco: true,
    specs: [
      ["Tipo", "Over-ear con cancelación de ruido activa"],
      ["Batería", "30 horas de reproducción"],
      ["Bluetooth", "5.3 con multipunto"],
      ["Códecs", "LDAC, AAC, SBC"],
      ["Extras", "Carga rápida: 5 min = 3 horas"]
    ]
  },
  {
    img: "img/sleek-black-smartwatch-on-a-minimalist-white-background-showcasing-modern-design-and-technology-photo.webp",
    nombre: "Smartwatch Fit Band 6",
    marca: "Xiaomi",
    precio: 590000,
    reco: true,
    specs: [
      ["Pantalla", "AMOLED 1.4\" táctil"],
      ["Sensores", "Frecuencia cardíaca, SpO2, GPS"],
      ["Batería", "14 días de uso"],
      ["Resistencia", "5 ATM"],
      ["Compatibilidad", "Android e iOS"]
    ]
  },
  {
    img: "img/2025-PS5-Digital-Hero-6-laying-console-dualsense.webp",
    nombre: "Consola GameBox X",
    marca: "PlayStation",
    precio: 2100000,
    specs: [
      ["CPU", "AMD Zen 2, 8 núcleos a 3.5 GHz"],
      ["GPU", "10.28 TFLOPS RDNA 2"],
      ["Almacenamiento", "SSD 1 TB ultra rápido"],
      ["Resolución", "Hasta 4K 120 fps"],
      ["Incluye", "1 mando DualSense"]
    ]
  },
  {
    img: "img/D_Q_NP_2X_622664-MLA82666831331_022025-V.webp",
    nombre: "Parlante SoundMax Mini",
    marca: "JBL",
    precio: 390000,
    specs: [
      ["Potencia", "20 W RMS"],
      ["Batería", "12 horas de reproducción"],
      ["Resistencia", "IP67 (agua y polvo)"],
      ["Conectividad", "Bluetooth 5.1, NFC"],
      ["Extras", "Modo estéreo con 2 unidades"]
    ]
  },
  {
    img: "img/medium02_ebc55f20-5efa-41ba-9cfd-2be86fcbad4f.webp",
    nombre: "Monitor Vision 27\"",
    marca: "LG",
    precio: 1450000,
    reco: true,
    specs: [
      ["Resolución", "QHD 2560 x 1440"],
      ["Tasa de refresco", "144 Hz"],
      ["Panel", "IPS, 1 ms de respuesta"],
      ["HDR", "HDR10"],
      ["Puertos", "2x HDMI 2.1, 1x DisplayPort"]
    ]
  },
  {
    img: "img/D_Q_NP_2X_995674-MLM52844956762_122022-V.webp",
    nombre: "Teclado Mecánico Pro",
    marca: "Logitech",
    precio: 520000,
    specs: [
      ["Switches", "Red lineales (hot-swap)"],
      ["Iluminación", "RGB por tecla"],
      ["Conexión", "2.4 GHz, Bluetooth y USB-C"],
      ["Batería", "40 horas con RGB"],
      ["Layout", "Español, 60% compacto"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Tablet NotePad 11",
    marca: "Samsung",
    precio: 1800000,
    specs: [
      ["Pantalla", "11\" LCD 2K, 120 Hz"],
      ["Procesador", "Octa-core 2.4 GHz"],
      ["Almacenamiento", "128 GB"],
      ["RAM", "8 GB"],
      ["Batería", "8000 mAh"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Drone SkyHawk 4K",
    marca: "DJI",
    precio: 2400000,
    specs: [
      ["Cámara", "4K 60 fps con estabilización"],
      ["Alcance", "8 km de transmisión"],
      ["Vuelo", "34 minutos por batería"],
      ["Extras", "GPS + retorno automático"],
      ["Peso", "249 g"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Router WiFi 6 Mesh",
    marca: "TP-Link",
    precio: 350000,
    specs: [
      ["Estándar", "WiFi 6 (802.11ax)"],
      ["Velocidad", "Hasta 1800 Mbps"],
      ["Cobertura", "Hasta 150 m²"],
      ["Puertos", "3x Gigabit Ethernet"],
      ["Extras", "Malla compatible con 2 unidades"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Cámara Web HD Pro",
    marca: "Logitech",
    precio: 150000,
    specs: [
      ["Resolución", "1080p Full HD"],
      ["Campo de visión", "78°"],
      ["Micrófono", "Doble con reducción de ruido"],
      ["Montaje", "Clip universal + trípode"],
      ["USB", "USB-A plug and play"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Impresora Laser B&W",
    marca: "HP",
    precio: 750000,
    specs: [
      ["Tipo", "Láser monocromo"],
      ["Velocidad", "20 ppm"],
      ["Resolución", "1200 x 1200 dpi"],
      ["Conectividad", "WiFi, USB"],
      ["Bandeja", "150 hojas"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Batería Externa 20000mAh",
    marca: "Anker",
    precio: 120000,
    specs: [
      ["Capacidad", "20000 mAh"],
      ["Salida", "22.5 W rápida"],
      ["Puertos", "2x USB-A, 1x USB-C"],
      ["Peso", "350 g"],
      ["Extras", "Carga simultánea de 3 dispositivos"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Cargador Inalámbrico 15W",
    marca: "Xiaomi",
    precio: 90000,
    specs: [
      ["Potencia", "15 W"],
      ["Estándar", "Qi"],
      ["Compatibilidad", "Android e iPhone"],
      ["Extras", "Base antideslizante"],
      ["Entrada", "USB-C"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Cable USB-C Trenzado 2m",
    marca: "Ugreen",
    precio: 25000,
    specs: [
      ["Conectores", "USB-C a USB-C"],
      ["Longitud", "2 metros"],
      ["Carga", "Hasta 100 W"],
      ["Datos", "480 Mbps"],
      ["Material", "Nylon trenzado reforzado"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Disco Duro Externo 2TB",
    marca: "Seagate",
    precio: 420000,
    specs: [
      ["Capacidad", "2 TB"],
      ["Interfaz", "USB 3.2 Gen 1"],
      ["Velocidad", "Hasta 140 MB/s"],
      ["Compatibilidad", "Windows, Mac, PS4, PS5"],
      ["Extras", "Software de respaldo incluido"]
    ]
  },
  {
    img: "img/placeholder.webp",
    nombre: "Estación de Carga Multidispositivo",
    marca: "Anker",
    precio: 200000,
    specs: [
      ["Salidas", "6 puertos USB"],
      ["Potencia total", "65 W"],
      ["Carga rápida", "1 puerto 45 W"],
      ["Protecciones", "Sobrecarga y temperatura"],
      ["Extras", "Luz de estado LED"]
    ]
  }
];
