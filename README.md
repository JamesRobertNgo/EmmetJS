# EmmetJS

A JavaScript nodes generator and nodes modifier, through the use of [Emmet abbreviations](http://emmet.io).

The goal is to take advantage of the Emmet abbreviations as a shortcut on creating HTML elements.

```javascript
var container = document.createElementById('#container');

// INSERT DESIRED ELEMENT STRUCTURE
emmet.append([container], 'h1{Lorem Ipsum} + p{Lorem ipsum dolor sit amet, consectetur adipiscing elit.} + p > {Nunc aliquam faucibus maximus. Aliquam mattis suscipit } + a{ipsum} + { porttitor sagittis.}');
```
Results to

```html
<div id="container"><h1>Lorem Ipsum</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Nunc aliquam faucibus maximus. Aliquam mattis suscipit <a>ipsum</a> porttitor sagittis.</p></div>
```

## Abbreviation Configuration

```javascript
emmet.abbreviation = {
	'bq': 'blockquote',
	'img': 'img[alt=""]'
};
```

A way to 

## Make Function

## Mod Function

## APPEND

## PREPEND

## INSERT BEFORE

## INSERT AFTER