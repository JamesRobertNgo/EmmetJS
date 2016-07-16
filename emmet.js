
window.emmetJS = function(emmetStr) {
	
	// ---
	
	function getOperation(nodes, emmetStr) {
		
		var nextNodes = null;
		
		var match = /[\>\+\^\*#\.\[\{]/.exec(emmetStr);
		
		if (!match) // NO MATCH
			return;
		
		// FORK BASED ON (FIRST) MATCHED
		
		switch (match[0]) {
		case '>':
			
			// CHILD
			
			nextNodes = getElement(emmetStr);

			for (var i = 0; i < nodes.length; i++)
				for (var j = 0; j < nextNodes.length; j++)
					nodes[i].appendChild(nextNodes[j].cloneNode(true));
			
			break;
		
		case '+':
			
			// SIBLING
			
			nextNodes = getElement(emmetStr);

			for (var i = 0; i < nextNodes.length; i++)
				nodes.push(nextNodes[i].cloneNode(true));
			
			break;
		
		case '^':
			
			// CLIMB-UP (PART 1)
			
			nextNodes = getElement(emmetStr);
			
			nodes.climbup = nextNodes;
			
			break;
		
		case '*':
			
			// MULTIPLICATION
			
			var matchParam = /[0-9]+/.exec(emmetStr);
			
			if (!matchParam)
				break;
			
			var copyNodes = [];
			
			for (var i = 0; i < nodes.length; i++)
				copyNodes.push(nodes[i].cloneNode(true));
			
			for (var i = 0; i < parseInt(matchParam[0]) - 1; i++)
				for (var j = 0; j < copyNodes.length; j++)
					nodes.push(copyNodes[j].cloneNode(true));
			
			emmetStr = emmetStr.substring(matchParam.index + matchParam[0].length);
			
			emmet.getOperation(nodes, emmetStr);
			
			break;
		
		case '#':
			
			// ID ATTRIBUTE
			
			emmetStr = emmetStr.substring(match.index + 1);
			
			var textMatch = /[a-zA-Z0-9_\-]+/.exec(emmetStr);
			
			emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length);
			
			if (!textMatch)
				break;
			
			for (var i = 0; i < nodes.length; i++)
				nodes[i].setAttribute('id', textMatch[0]);
			
			emmet.getOperation(nodes, emmetStr);
			
			break;
		
		case '.':
			
			// CLASS ATTRIBUTE
			
			emmetStr = emmetStr.substring(match.index + 1);
			
			var textMatch = /[a-zA-Z0-9_\-]+/.exec(emmetStr);
			
			emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length);
			
			if (!textMatch)
				break;
			
			for (var i = 0; i < nodes.length; i++) {
				
				var classValue = nodes[i].getAttribute('class') || '';
				
				classValue += ((classValue.length > 0) ? ' ' : '' ) + textMatch[0];
				
				nodes[i].setAttribute('class', classValue);
			}

			emmet.getOperation(nodes, emmetStr);
			
			break;
		
		case '[':
			
			// CUSTOM ATTRIBUTE
			
			console.log(emmetStr);
			
			emmetStr = emmetStr.substring(match.index + 1);
			
			var textMatch = /[^\]]+/.exec(emmetStr);
			
			emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length);
			
			if (!textMatch)
				break;
			
			var attributesStr = textMatch[0].trim().replace(/\s*=\s*/g, '=');
			
			// CONVERT SPACE IN VALUE PORTION
			attributesStr = attributesStr.replace(/"([^"]*)"/g, function($0, $1) {
				return $1.replace(/\s/g, '_._');
			});
			
			var attributes = attributesStr.split(' ');
			
			console.log(attributes);
			
			for (var i = 0; i < nodes.length; i++)
				for (var j = 0; j < attributes.length; j++) {
					
					var attr = attributes[j];
					
					var attrParts = attr.split('=');
					
					if (attrParts[1] == undefined)
						attrParts[1] = '';
					
					// REVERT SPACE IN VALUE PORTION
					attrParts[1] = attrParts[1].replace(/_\._/g, ' ');
					
					nodes[i].setAttribute(attrParts[0], attrParts[1]);
				}

			getOperation(nodes, emmetStr);
			
			break;
		
		case '{':
			
			// TEXT
			
			emmetStr = emmetStr.substring(match.index + 1);
			
			var textMatch = /[^\}]+/.exec(emmetStr);
			
			emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length + 1);
			
			if (!textMatch)
				break;
			
			for (var i = 0; i < nodes.length; i++)
				nodes[i].appendChild(document.createTextNode(textMatch[0]));
			
			getOperation(nodes, emmetStr);
			
			break;
		}
		
		// MERGE FORK
		
		// CLIMB-UP (PART 2)
		if (!!nextNodes && !!nextNodes.climbup) {
			
			for (var i = 0; i < nextNodes.climbup.length; i++)
				nodes.push(nextNodes.climbup[i].cloneNode(true));
			
			delete nextNodes.climbup;
		}
	}
	
	// ---
	
	function getElement(emmetStr) {
		
		var nodes = [];
		
		var match = /[\(\{a-zA-Z]/.exec(emmetStr);

		if (!match)
			return nodes;
		
		// FORK BASE ON (FIRST) MATCHED
		
		switch (match[0]) {
		case '(':
			
			// GROUP
			
			emmetStr = emmetStr.substring(match.index + 1);
			
			var newEmmet = '';
			var counter = 1;
			
			while(counter > 0) {
				
				var matchBracket = /[\(\)]/.exec(emmetStr);
				
				if (!matchBracket) {
					counter = 0;
					continue;
				}
				
				if (matchBracket[0] == '(')
					counter += 1;
				else
					counter -= 1;
				
				newEmmet += emmetStr.substring(0, matchBracket.index + 1);
				emmetStr = emmetStr.substring(matchBracket.index + 1);
			}
			
			newEmmet = newEmmet.substring(0, newEmmet.length - 1);
			
			nodes.push(getElement(newEmmet));
			
			break;
			
		case '{':
			
			// TEXT NODE
			
			emmetStr = emmetStr.substring(match.index + 1);
			
			var textMatch = /[^\}]+/.exec(emmetStr);
			
			if (!textMatch) {
				
				emmetStr = '';
				
			} else {
				
				emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length + 1);
				
				nodes.push(document.createTextNode(textMatch[0]));
			}
			
			break;
		
		default:
			
			// ELEMENTS NODE
			
			console.log('ELEMENTS NODE');
			
			emmetStr = emmetStr.substring(match.index);
			
			var matchNameRegExp = /[a-zA-Z0-9]+/;
			var matchName = matchNameRegExp.exec(emmetStr);
			
			emmetStr = emmetStr.substring(matchName.index + matchName[0].length);
			
			// MODIFY EMMET STRING IF ELEMENT NAME MATCHES ABBREVIATION
			
			console.log(matchName[0].toLowerCase(), emmetJS.abbreviation[matchName[0].toLowerCase()]);
			
			if (emmetJS.abbreviation[matchName[0].toLowerCase()]) {
				
				emmetStr = emmetJS.abbreviation[matchName[0].toLowerCase()] + emmetStr;
				
				matchName = matchNameRegExp.exec(emmetStr);
			
				emmetStr = emmetStr.substring(matchName.index + matchName[0].length);
			}
			
			nodes.push(document.createElement(matchName[0]));
		}
		
		// MERGE FORK
		
		getOperation(nodes, emmetStr);
		
		return nodes;
	}
	
	// ---
	
	return getElement(emmetStr);
};

emmetJS.abbreviation = {
	'ah': 'a[href="#"]',
	'bq': 'blockquote',
	'img': 'img[alt=""]',
	
};