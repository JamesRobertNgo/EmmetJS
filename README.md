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
emmet.make(abbr); // Returns an array of Nodes generated
```

Works with the emmet.mod() function to generate nodes as specified by the Emmet abbreviation.
It takes a sing parameter (Emmet abbreviation) and returns an array of Nodes generated.

## Mod Function

```javascript
emmet.make(nodes, abbr); // Returns an array of Nodes modified
```

Works with emmet.make() function to modify an array of nodes as specified by the Emmet abbreviation.
It takes two parameter: the array of nodes and the Emmet abbreviation, and returns the array of nodes being modified.

This function will seek out several operators:
- Child operator (>)
- Sibling operator (+)
- Parent operator (^)
- Multiplication operator (*)
- ID Attribute (#)
- Class Attribute (.)
- Custom Attribute ([name="value"...])
- Text ({text...})

Note: emmet.make also handles text in the instance where the text operator is preceded with another operator.

## Append Function

```javascript
emmet.append(nodes, abbr); // Returns an array of child Nodes generated
```

A convenience function.
Appends generated nodes to the nodes supplied in the parameter.

## Prepend Function

```javascript
emmet.prepend(nodes, abbr); // Returns an array of child Nodes generated
```

A convenience function.
Prepends generated nodes to the nodes supplied in the parameter.

## Insert Before Function

```javascript
emmet.insertBefore(nodes, abbr); // Returns an array of sibling Nodes generated
```

A convenience function.
Insert generated nodes before the nodes supplied in the parameter.

## Insert After Function

```javascript
emmet.insertAfter(nodes, abbr); // Returns an array of sibling Nodes generated
```

A convenience function.
Insert generated nodes after the nodes supplied in the parameter.