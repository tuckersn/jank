# Jank
An aptly named React & Electron based personal toolbox.

## ⚠️ SECURITY DISCLAIMER ⚠️
This application is insecure, **USE AT YOUR OWN RISK.** This project was designed to be educational and entertainment.

This early into development especially there are a number of extremely insecure aspects of this project. Using this project out of the box shouldn't pose any threats, but to enable the maximum user power the program it is inherently dangerous from a cyber security perspective.

### Extensions
Extensions are compiled into the application itself, they are even loaded before the majority of the application. There is no limitations on extensions, they are complete packages with their own dependencies and no isolation. ***Do not download untrusted extensions, there are no protections.*** This application is a monorepo where extensions are just another package, and extensions can share code between each other.

### Bugs unrelated to security
Visual bugs such as those related to BrowserViews may be unavoidable or not worth the effort, these issues will be archived under the unavoidable tag for future reference. Example: many panels will not layer correctly due to use of [Electron's BrowerViews](https://www.electronjs.org/docs/latest/api/browser-view). 

## Requirements
Currently only tested against Windows 10.

Requires Git(Git bash) and Node 14+

Following NPM packages required globally.
```
npm install -g yarn
npm install -g typescript
npm install -g sass
```

Run the yarn install command in each yarn package, and then use the bash scripts in the root directory to build/start.

## Todo list

### Interface

#### Web browser
Features:
- Tab movement between windows.
- Redirect location field to a search engine query on invalid urls.
- Fix subscriptions not being unsubscribed from when a tab is removed.
### Electron

### Process manager

### Shared