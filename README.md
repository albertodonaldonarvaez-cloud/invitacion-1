# 💍 Invitación Digital - 50 Aniversario

Invitación digital interactiva para la celebración de 50 años de matrimonio de **José Renato & María Isabel**.

## ✨ Características

- 🎨 Diseño premium con tema dorado y animaciones
- ✉️ Sobre interactivo con sello de cera realista
- 🖼️ Galería de fotos con marco elegante y autoplay
- ⏳ Cuenta regresiva en tiempo real
- 📍 Mapa de Google Maps integrado con ubicación exacta
- 📱 100% responsive (móvil y escritorio)
- 🎵 "Te Quiero" de José Luis Perales con fade-in al abrir
- 🌸 Partículas y pétalos animados

## 🚀 Ejecutar localmente

```bash
npx -y serve . -p 3000
```

Abre [http://localhost:3000](http://localhost:3000)

## 🐳 Docker

### Construir imagen

```bash
docker build -t invitacion-50-aniversario .
```

### Ejecutar contenedor

```bash
docker run -d -p 8080:80 --name invitacion invitacion-50-aniversario
```

Abre [http://localhost:8080](http://localhost:8080)

### Docker Compose (opcional)

```yaml
version: '3.8'
services:
  invitacion:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

```bash
docker compose up -d
```

## 📁 Estructura

```
├── index.html      # Estructura principal
├── styles.css      # Estilos y animaciones
├── script.js       # Lógica interactiva
├── te-quiero.mp3   # 🎵 Música de fondo (fade-in automático)
├── img/            # Fotografías de la pareja
├── Dockerfile      # Contenedor Docker (nginx:alpine)
├── nginx.conf      # Configuración nginx con gzip + caché
└── README.md
```

## 📋 Detalles del evento

| Detalle | Info |
|---------|------|
| **Pareja** | José Renato & María Isabel |
| **Celebración** | 50 Años de Matrimonio |
| **Fecha** | 11 de Abril, 2026 |
| **Lugar** | Salón de Eventos Sol y Luna |
| **Dirección** | Av. 20 de Noviembre, La Junta, Chih. |

## ⚡ Optimizaciones

- Imágenes con `loading="lazy"`
- Script con `defer`
- Mapa embebido con lazy loading
- Sin pétalos en pantallas < 480px
- Partículas reducidas en móvil
- Nginx con gzip y caché de assets

---

Hecho con ❤️ para los 50 años de José Renato & María Isabel
