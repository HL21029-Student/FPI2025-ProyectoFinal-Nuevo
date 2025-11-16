# 🔥 Guía para configurar Firebase - Paso a Paso

## ⚠️ SOLO PARA EL PROPIETARIO DEL PROYECTO

Sigue estos pasos EXACTAMENTE como están escritos:

---

## Paso 1: Abrir Firebase Console

1. Ve a tu navegador (Chrome, Edge, Firefox, etc.)
2. Abre este enlace: https://console.firebase.google.com/project/proyectofpi-81939/firestore/databases/-default-/rules
3. Inicia sesión con tu cuenta de Google (la que usaste para crear Firebase)

---

## Paso 2: Configurar las Reglas de Firestore

Verás una pantalla con un editor de código. Actualmente probablemente dice algo como:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ← Esto bloquea todo
    }
  }
}
```

### ✅ BORRA TODO el código que aparece

### ✅ COPIA Y PEGA exactamente este código:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leer y escribir en la colección celulares
    match /celulares/{celularId} {
      allow read, write: if true;
    }

    // Permite leer y escribir en cualquier colección (para desarrollo)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### ✅ Haz click en el botón azul que dice **"Publicar"** o **"Publish"**

---

## Paso 3: Verificar que funcionó

1. En la misma consola de Firebase, ve a: https://console.firebase.google.com/project/proyectofpi-81939/firestore/databases/-default-/data
2. Deberías ver una colección llamada `celulares`
3. Si no ves datos, la aplicación los creará automáticamente cuando se ejecute

---

## Paso 4: Compartir credenciales con tu compañero

### Opción 1: Por WhatsApp/Discord/Email

Envíale el archivo `SETUP-INSTRUCCIONES.md` que está en la raíz del proyecto.

### Opción 2: Verbalmente

Dile que:

1. Clone el repositorio de GitHub
2. Cree un archivo `.env` en la raíz
3. Copie el contenido de Firebase que está en `SETUP-INSTRUCCIONES.md`

---

## ✅ ¡Listo!

Ahora tu compañero podrá:

- Leer los datos de Firebase
- Crear nuevos productos
- Ver las estadísticas
- Todo funcionará correctamente

---

## 🔒 Nota de Seguridad

⚠️ Las reglas actuales permiten acceso total (para desarrollo).

Cuando terminen el proyecto, deberían restringir el acceso. Pero por ahora, déjalas así para que funcione.

---

## ❓ ¿Problemas?

Si después de hacer esto tu compañero sigue sin poder leer los datos:

1. Verifica que hizo el archivo `.env` correctamente
2. Verifica que las reglas se publicaron (vuelve a revisar en Firebase Console)
3. Pídele que cierre y abra su proyecto nuevamente
4. Si sigue sin funcionar, pídele que ejecute: `npm install` y `npm run dev` de nuevo
