# ViDChainAPP

### Set Up

1. Descargamos el repositorio
2. Instalamos las dependencias 
```sh
 npm install
```
3. Creamos el Platform Android
```sh
 ionic cordova platform add android@6.4.0
```
***se utiliza la version 6.4.0 porque la 7.0.0 da problemas***

4. Ponemos los google-services.json en la raiz :  `platform/android`

5. Hacemos Build de Android
```sh
 ionic cordova build android
```

### Actualizar iconos y/o splash screen

1. sustituir los ficheros `icon.png` y/o `splash.png` de la carpeta `/resources` por los nuevos.
2. Regenerar los iconos con el siguiente comando:
```
ionic cordova resources
```
