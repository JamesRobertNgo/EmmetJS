# EmmetJS

A JavaScript nodes generator and nodes modifier, through the use of [Emmet abbreviations](http://emmet.io).

The goal is to take advantage of the Emmet abbreviations as a shortcut on creating HTML elements.

Example:

```javascript
var container = document.createElementById('#container');

// INSERT DESIRED ELEMENT STRUCTURE
emmet.append([container], 'h1{Lorem Ipsum} + p{Lorem ipsum dolor sit amet, consectetur adipiscing elit.} + p > {Nunc aliquam faucibus maximus. Aliquam mattis suscipit } + a{ipsum} + { porttitor sagittis.}');
```
Results to:

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

EmmetJS can be extended using the emmet.abbreviation object.
The object key will be matched with the Emmet abbreviation and replaces it with the object value.
This is a good way to allow for shortcut names and / or for including essential attributes and modification.

The abbreviation object key must be in lowercase.
This allows matching the key to the abbreviation easier, allowing the user to type the abbreviation in any sentence case.

Example:

We want the abbreviation 'uli' to create the ul element with atleast one li element

```javascript
emmet.abbreviation['uli'] = 'ul > li';

console.log(emmet.make('uli{listItem}'));
// Result to <ul><li>listItem</li></ul>

console.log(emmet.make('uli{listItem} * 3'));
// Result to <ul><li>listItem</li><li>listItem</li><li>listItem</li></ul>
```


## Make Function

```javascript
emmet.make(abbr);
```

## Mod Function

```javascript
emmet.make(nodes, abbr);
```

## Append

```javascript
emmet.append(nodes, abbr);
```

## Prepend

```javascript
emmet.prepend(nodes, abbr);
```

## Insert Before

```javascript
emmet.insertBefore(nodes, abbr);
```

## Insert After

```javascript
emmet.insertAfter(nodes, abbr);
```