# 📱 Tienda CellPhone - Instrucciones de Instalación

## 🚀 Para el compañero (Primera vez)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/HL21029-Student/Proyecto_FPI25.git
cd Proyecto_FPI25
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar Firebase (IMPORTANTE ⚠️)

Debes crear un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que `package.json`).

**Contenido del archivo `.env`:**

```env
VITE_FIREBASE_API_KEY="AIzaSyBqi_T1FPyPvQ0MO7i5uMSo0XN4GGWdAjQ"
VITE_FIREBASE_AUTH_DOMAIN="proyectofpi-81939.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="proyectofpi-81939"
VITE_FIREBASE_STORAGE_BUCKET="proyectofpi-81939.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="304836201267"
VITE_FIREBASE_APP_ID="1:304836201267:web:a02f2b85f5a5518c2a8c46"
```

**⚠️ IMPORTANTE:**

- Este archivo NO se sube a GitHub (está en .gitignore)
- Copia EXACTAMENTE este contenido (incluyendo las comillas)
- El archivo debe llamarse `.env` (con el punto al inicio, sin extensión)

### Paso 4: Ejecutar el proyecto

```bash
npm run dev
```

La aplicación se abrirá en tu navegador en `http://localhost:9000` (o el puerto que muestre la terminal).

---

## 🔄 Para actualizar el proyecto

Si ya tienes el proyecto clonado y quieres obtener los últimos cambios:

```bash
git pull origin master
npm install
npm run dev
```

---

## ❌ Solución de problemas comunes

### Error: "No se pueden leer los datos de Firebase"

✅ **Solución:** Verifica que el archivo `.env` esté creado correctamente en la raíz del proyecto.

### Error: "Permission denied" o "PERMISSION_DENIED"

✅ **Solución:** Las reglas de Firestore deben estar configuradas. Contacta al administrador del proyecto.

### El proyecto no inicia

✅ **Solución:**

1. Borra la carpeta `node_modules`
2. Ejecuta `npm install` nuevamente
3. Ejecuta `npm run dev`

---

## 📦 Tecnologías utilizadas

- **Quasar Framework** (Vue.js)
- **Firebase Firestore** (Base de datos)
- **Chart.js** (Gráficos estadísticos)
- **Vue Router** (Navegación)

---

## 👥 Colaboradores

- Propietario del proyecto: [Tu nombre]
- Colaborador: [Nombre del compañero]

---

## 📞 Contacto

Si tienes problemas, contacta al administrador del proyecto.
