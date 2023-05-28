# frontend-ticket-seller

## Correr el proyecto localmente

### Ir al directorio del frontend.

```sh
cd e1-2023-1-grupo-23-frontend/

```

### Copiar lo siguiente en un archivo `.env` en el directorio raíz del repositorio.

```
VITE_API_SERVER_URL=http://localhost:8000
VITE_AUTH0_DOMAIN=dev-50f4e6m1x3lgsmgu.us.auth0.com
VITE_AUTH0_CLIENT_ID=pLjAz4iRagIEUEN8pnWrAah8MLiA7cMt
VITE_AUTH0_CALLBACK_URL=http://localhost:5173/callback
VITE_API_AUDIENCE=https://stefanocando.me/

```

### Instalar las dependencias.

```sh
npm install
```

### Levantar un servidor local

```
npm run dev -- --port 5173
```

PD: *es importante levantar el servidor en el puerto 5173 por temas de configuración de auth0*

## CI/CD

El CI/CD del frontend fue implementado mediante CircleCI, el cual se activa cada vez que se sube un nuevo commit a la branch `master`

El flujo que sigue el CI/CD y que esta configurado en `.circleci/config.yml` sigue el siguiente flujo:

1. Instalación de  AWS CLI en un container docker.
2. Instalación de las dependencias necesarias para un proyecto Vue con Vite
3. Build del proyecto Vue el cual genera el contenido estático de la aplicación en el directorio `dist/`
4. Se configuran las credenciales de AWS y luego se sube a un bucket S3 el contenido presente en `dist/`
5. Se invalida la cache de Cloudfront para que se muestre siempre la última versión de la página servida en el bucket S3

El deploy de la página se hace de forma automática siempre y cuando no falle alguno de los pasos anteriormente nombrados.
