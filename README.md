# humanize-time-tool

![npm version](https://img.shields.io/npm/v/humanize-time-tool.svg)  
![npm downloads](https://img.shields.io/npm/dm/humanize-time-tool.svg)  
![license](https://img.shields.io/npm/l/humanize-time-tool.svg?cacheBust=1)  

A simple and lightweight Node.js library for human-friendly time formatting with built-in localization (i18n) support.

## Features

- Format timestamps as "time ago" strings (e.g., "5 minutes ago")
- Supports 20+ languages with easy language switching
- Customizable and extendable translations  
- Lightweight and dependency-free  
- Automatic fallback to Swedish if translation is missing  
- Suitable for server-side rendering and client-side use

## Supported Languages

<!-- LANGUAGES_START -->
- ar - Arabic  
- be - Belarusian  
- bs - Bosnian  
- bg - Bulgarian  
- cs - Czech  
- da - Danish  
- de - German  
- el - Greek  
- en - English  
- es - Spanish  
- et - Estonian  
- fa - Persian  
- fi - Finnish  
- fr - French  
- he - Hebrew  
- hi - Hindi  
- hr - Croatian  
- hu - Hungarian  
- is - Icelandic  
- it - Italian  
- ja - Japanese  
- ko - Korean  
- lt - Lithuanian  
- lv - Latvian  
- nl - Dutch  
- no - Norwegian  
- pl - Polish  
- pt - Portuguese  
- ro - Romanian  
- ru - Russian  
- sk - Slovak  
- sl - Slovenian  
- sr - Serbian  
- sv - Swedish  
- th - Thai  
- tr - Turkish  
- uk - Ukrainian  
- vi - Vietnamese  
- zh - Chinese  
<!-- LANGUAGES_END -->

## Installation

```bash
npm install humanize-time-tool
Usage
import { timeAgo } from 'humanize-time-tool';

console.log(timeAgo(new Date(Date.now() - 5 * 60 * 1000), 'en')); // "5 minutes ago"
console.log(timeAgo('2025-01-01T00:00:00Z', 'sv'));              // "för några sekunder sedan" (example Swedish translation)

console.log(timeAgo(Date.now() - 3600 * 1000, 'en', { hour_one: 'an hour ago' })); // Custom override for one-hour string
Language Middleware
This library provides a middleware function languageMiddleware to register and limit which languages are allowed (activated) at runtime.

You can use the middleware in your server (e.g., Express) to specify allowed languages with one of these options:

['*'] — allow all available languages
['sv', 'en'] — allow only specific languages, in this example Swedish and English
Example usage in Express:

import express from 'express';
import { languageMiddleware } from 'humanize-time-tool';

const app = express();

// Allow only Swedish and English
app.use(languageMiddleware(['sv', 'en']));

// Or allow all languages
// app.use(languageMiddleware(['*']));
This approach ensures only the specified languages are registered and available via getTranslations() or timeAgo().

Important Notes
Translations are fully included inside the JavaScript code and loaded automatically.
There is no need to load external translation files or call loadTranslations() in normal usage.
The loadTranslations() function remains exported only for advanced use cases like dynamically updating or overriding translations at runtime.
API Reference
timeAgo(dateInput, lang = 'sv', customTranslations = {})
Formats a given date into a localized "time ago" string.

dateInput: Date object, ISO string, or timestamp
lang: Language code (default 'sv')
customTranslations: Optional object to override specific translation strings
Returns a string such as "5 minutes ago" or "för 5 minuter sedan".

getTranslations(lang)
Returns the translations object for the specified language if available; otherwise returns undefined.

loadTranslations()
(Optional) Asynchronously loads translations from an external JSON file and merges them with built-in defaults. Normally not needed since translations are included in the package.

License
MIT

Readme
