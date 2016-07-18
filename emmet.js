/**
 * Autor: James Robert Huggins Ngo
 * Date:  2016-07-18
 *
 * Repository:     https://github.com/JamesRobertNgo/EmmetJS
 * Tagged Version: v2.1
 **/


// ==========
// NAMESPACE
// ==========

window.emmet = {}


// ==========
// ATTRIBUTES
// ==========

emmet.abbreviation = {
	'bq': 'blockquote',
	'img': 'img[alt=""]'
};


// ==========
// MAKE ELEMENTS
// ==========

emmet.make = function(abbr) {
	
	abbr = abbr || '';
	
	var nodes = [];
	
	var match = /[#\.\(\{a-zA-Z]/.exec(abbr);
	
	if (!match)
		return nodes;
	
	// FORK BASE ON (FIRST) MATCHED
	
	switch (match[0]) {
	case '#':
	case '.':
		
		// TODO - MAKE ELEMENT BASED ON PARENT ELEMENT
		
		nodes.push(document.createElement('div'));
		
		break;
		
	case '(':
		
		// GROUP
		
		var matchBracket = null;
		
		var subAbbr = '';
		var counter = 0;
		
		abbr = abbr.substring(match.index);
		
		do {
			
			matchBracket = /[\(\)]/.exec(abbr);
			
			if (!matchBracket) {
				counter = 0;
				subAbbr += abbr;
				abbr = '';
				continue;
			}
			
			switch (matchBracket[0]) {
			case '(':
				counter += 1;
				break;
			case ')':
				counter -= 1;
				break;
			}
			
			subAbbr += abbr.substring(0, matchBracket.index + 1);
			abbr = abbr.substring(matchBracket.index + 1);
			
		} while(counter > 0);
		
		if (matchBracket)
			nodes = emmet.make(subAbbr.substring(1, subAbbr.length - 1));
		
		break;
		
	case '{':
		
		// TEXT NODE
		
		var textMatch = /[^\}]+/.exec(abbr);
		
		if (!textMatch) {
			nodes.push(document.createTextNode(abbr.substring(match.index + 1)))
			abbr = '';
		} else {
			nodes.push(document.createTextNode(textMatch[0].substring(match.index + 1)));
			abbr = abbr.substring(textMatch[0].length + 1);
		}
		
		break;
	
	default:
		
		// ELEMENTS NODE
		
		var matchName = /[a-zA-Z0-9]+/.exec(abbr);
		
		// MODIFY EMMET STRING IF ELEMENT NAME MATCHES ABBREVIATION
		
		var abbrMod = emmet.abbreviation[matchName[0].toLowerCase()];
		
		if (abbrMod) {
			abbr = abbrMod + abbr.substring(matchName.index + matchName[0].length);
			matchName = /[a-zA-Z0-9]+/.exec(abbr);
		}
		
		abbr = abbr.substring(matchName.index + matchName[0].length);
		
		nodes.push(document.createElement(matchName[0]));
	}
	
	// MERGE FORK
	
	emmet.mod(nodes, abbr);
	
	return nodes;
};


// ==========
// MODIFY ELEMENTS
// ==========

emmet.mod = function(nodes, abbr) {
	
	console.log('emmet.mod', nodes, abbr);
	
	nodes = nodes || [];
	
	if (!nodes.length)
		nodes = [nodes];
	
	abbr = abbr || [];
	
	var match = /[\>\+\^\*#\.\[\{]/.exec(abbr);
	
	console.log('match', match);
	
	if (!match) // NO MATCH
		return;
		
	var nextNodes = null;
	
	// FORK BASED ON (FIRST) MATCHED
	
	switch (match[0]) {
	case '>':
	
		// CHILD
		
		nextNodes = emmet.make(abbr);

		for (var i = 0; i < nodes.length; i++)
			for (var j = 0; j < nextNodes.length; j++)
				nodes[i].appendChild(nextNodes[j].cloneNode(true));
		
		break;
		
	case '+':
	
		// SIBLING
		
		nextNodes = emmet.make(abbr);

		for (var i = 0; i < nextNodes.length; i++)
			nodes.push(nextNodes[i].cloneNode(true));
		
		break;
		
	case '^':
	
		// CLIMB-UP (PART 1)
		
		nextNodes = emmet.make(abbr);
		
		nodes.climbup = nextNodes;
		
		break;
		
	case '*':
	
		// MULTIPLICATION
		
		var matchParam = /[0-9]+/.exec(abbr);
		
		if (!matchParam)
			break;
		
		var copyNodes = [];
		
		for (var i = 0; i < nodes.length; i++)
			copyNodes.push(nodes[i].cloneNode(true));
		
		for (var i = 0; i < parseInt(matchParam[0]) - 1; i++)
			for (var j = 0; j < copyNodes.length; j++)
				nodes.push(copyNodes[j].cloneNode(true));
		
		emmet.mod(nodes, abbr.substring(matchParam.index + matchParam[0].length));
		
		break;
	
	case '#':
		
		// ID ATTRIBUTE
		
		var idMatch = /[a-zA-Z0-9_\-]+/.exec(abbr);
		
		if (!idMatch)
			break;
		
		var idStr = idMatch[0];
		
		for (var i = 0; i < nodes.length; i++)
			nodes[i].setAttribute('id', idStr);
		
		emmet.mod(nodes, abbr.substring(idMatch.index + idMatch[0].length));
		
		break;
		
	case '.':
		
		// CLASS ATTRIBUTE
		
		var classMatch = /[a-zA-Z0-9_\-]+/.exec(abbr);
		
		if (!classMatch)
			break;
		
		var classStr = classMatch[0];
		
		for (var i = 0; i < nodes.length; i++)
			nodes[i].setAttribute('class', ((nodes[i].getAttribute('class')) ? nodes[i].getAttribute('class') + ' ' : '') + classStr);
		
		emmet.mod(nodes, abbr.substring(classMatch.index + classMatch[0].length));
		
		break;
		
	case '[':
		
		// CUSTOM ATTRIBUTE
		
		var attrMatch = /[^\]]+/.exec(abbr);
		
		if (!attrMatch)
			break;
		
		var attributesStr = attrMatch[0].substring(match.index + 1).trim().replace(/\s*=\s*/g, '=');
		
		// TRANSFORM SPACE TO UNIQUE PATTERN
		attributesStr = attributesStr.replace(/"([^"]*)"/g, function($0, $1) {
			return $1.replace(/\s/g, '_._');
		});
		
		var attributes = attributesStr.split(' ');
		
		for (var i = 0; i < nodes.length; i++)
			for (var j = 0; j < attributes.length; j++) {
				
				var attr = attributes[j];
				
				var attrParts = attr.split('=');
				
				if (attrParts[1] == undefined)
					attrParts[1] = '';
				
				// REVERT SPACE FROM UNIQUE PATTERN
				attrParts[1] = attrParts[1].replace(/_\._/g, ' ');
				
				nodes[i].setAttribute(attrParts[0], attrParts[1]);
			}
		
		emmet.mod(nodes, abbr.substring(attrMatch.index + attrMatch[0].length + 1));
		
		break;
		
	case '{':
		
		// TEXT
		
		var textMatch = /[^\}]+/.exec(abbr);
		
		var text = '';
		
		if (!textMatch) {
			text = abbr.substring(match.index + 1);
			abbr = '';
		} else {
			text = textMatch[0].substring(match.index + 1);
			abbr = abbr.substring(textMatch.index + textMatch[0].length + 1);
		}
		
		for (var i = 0; i < nodes.length; i++)
			nodes[i].appendChild(document.createTextNode(text));
		
		emmet.mod(nodes, abbr);
		
		break;
	}
	
	// MERGE FORK
	
	if (!!nextNodes && !!nextNodes.climbup) {
		
		// CLIMB-UP (PART 2)
		
		for (var i = 0; i < nextNodes.climbup.length; i++)
			nodes.push(nextNodes.climbup[i].cloneNode(true));
		
		delete nextNodes.climbup;
	}
	
	return nodes;
};


// ==========
// APPEND
// ==========

emmet.append = function(nodes, abbr) {
	
	abbr = abbr || '';
	
	nodes = nodes || [];
	
	if (!nodes.length)
		nodes = [nodes];
	
	var childNodes = emmet.make(abbr);
	
	for (var i = 0; i < nodes.length; i++)
		for (var j = 0; j < childNodes.length; j++)
			nodes[i].appendChild(childNodes[j].cloneNode(true));
	
	return childNodes;
};


// ==========
// PREPEND
// ==========

emmet.prepend = function(nodes, abbr) {
	
	abbr = abbr || '';
	
	nodes = nodes || [];
	
	if (!nodes.length)
		nodes = [nodes];
	
	var childNodes = emmet.make(abbr);
	
	for (var i = 0; i < nodes.length; i++) {
		var firstChild = nodes[i].firstChild;
		for (var j = 0; j < childNodes.length; j++)
			nodes[i].insertBefore(childNodes[j].cloneNode(true), firstChild);
	}
	
	return childNodes;
};


// ==========
// INSERT BEFORE
// ==========

emmet.insertBefore = function(nodes, abbr) {
	
	abbr = abbr || '';
	
	nodes = nodes || [];
	
	if (!nodes.length)
		nodes = [nodes];
	
	var siblingNodes = emmet.make(abbr);
	
	for (var i = 0; i < nodes.length; i++)
		for (var j = 0; j < siblingNodes.length; j++)
			nodes[i].parentNode.insertBefore(siblingNodes[j].cloneNode(true), nodes[i]);
	
	return siblingNodes;
};


// ==========
// INSERT AFTER
// ==========

emmet.insertAfter = function(nodes, abbr) {
	
	abbr = abbr || '';
	
	nodes = nodes || [];
	
	if (!nodes.length)
		nodes = [nodes];
	
	var siblingNodes = emmet.make(abbr);
	
	for (var i = 0; i < nodes.length; i++) {
		var siblingChild = nodes[i].nextSibling;
		for (var j = 0; j < siblingNodes.length; j++)
			nodes[i].parentNode.insertBefore(siblingNodes[j].cloneNode(true), siblingChild);
	}
	
	return siblingNodes;
};
