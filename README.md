# Задание 2. Адаптивная верстка

## Команды:

- "npm i" - установка пакетов
- "npm run start:client запуск клиентской части
- "npm run lint" - запуск линтера
- "npm run lint:fix" - запуск линтера с автофиксом

## Страницы 
- http://localhost:9000 – Экраны 1.1, 1.2, 1.3, 1.4
- http://localhost:9000/details.html – Экран 1.5
- http://localhost:9000/commit-history.html - Экран 1.6
- http://localhost:9000/branches.html - Экран 2.1
- http://localhost:9000/commit-page.html - Экран 3.1

## Структура
- src
    - client
        - assets/img - иконки
        - blocks - папки блоков и шаблоновю
        В виде шаблонов были описаны блоки **dropdown**, **preview** и **table**
        - pages - собранные из блоков страницы
        - scripts - входная точка для скриптов блоков
        - styles
            - **main.scss** - общие стили и входная точка для стилей блоков
            - **vars.scss** - переменные
    - server - серверный код, реализованный в домашнем задании по node.js
    
Для подсветки синтаксиса использовалась библиотека highlight.js https://www.npmjs.com/package/highlight.js?activeTab=dependencies