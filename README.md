# Jank
A personal toolbox designed for running miniature programs visually with loose coupling, built around a REPL.

## ⚠️ SECURITY DISCLAIMER ⚠️
This project is inherently insecure. It is provided as is, but there will be some security patches. This project is primarily for entertainment and educational purposes in mind. If you find value you in it, great!

This early into development especially there are a number of extremely insecure aspects of this project. Using this project out of the box shouldn't pose any threats, but to enable the maximum user power the program it is inherently dangerous from a cyber security perspective.

### Bugs unrelated to security
Visual bugs such as those related to BrowserViews may be unavoidable or not worth the effort, these issues will be archived under the unavoidable tag for future reference.

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