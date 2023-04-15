# Hello World in Inertia
### Getting started with Inertia
To get started with Inertia, you need to add `inertia.js` from the [repo](https://github.com/NotDragon/Inertia/src), to your working directory
Then you need to include it in you html like this:
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Inertia dev</title>
</head>
<body>
    ...
    <script src="inertia.js" type="module"></script>
</body>
</html>
```
#### Place it at the BOTTOM of you BODY

Then you need to add a display element at the palace you want Inertia to interact with the dom, in my case it's int the middle.
```HTML
<display></display>
```

Finally you can add your inertia code like this
```HTML
<inertia src="./main.in"></inertia>
```
or you can write your code directly in it
```HTML
<inertia>
    Your code
</inertia>
```
### Logging hello world
In Inertia logging hello world is a simple as using `log()` and putting what you want to log inside it. For example:
```JS
    log('Hello world');
```
In Inertia Semicolons are mandatory after statements like `log`;