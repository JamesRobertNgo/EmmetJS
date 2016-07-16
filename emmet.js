// EMMET

window.emmet = function(emmetStr) {

	return emmet.getElement(emmetStr);
}

// GET OPERATION

emmet.getOperation = function(nodes, emmetStr) {

	var nextNodes = null;

	var match = /[\>\+\^\*#\.\[\{]/.exec(emmetStr);

	if (!match) // NO MATCH
		return;

	switch (match[0]) {
	case '>': // CHILD

		nextNodes = emmet.getElement(emmetStr);

		for (var i = 0; i < nodes.length; i++)
			for (var j = 0; j < nextNodes.length; j++)
				nodes[i].appendChild(nextNodes[j].cloneNode(true));

		break;

	case '+': // SIBLING

		nextNodes = emmet.getElement(emmetStr);

		for (var i = 0; i < nextNodes.length; i++)
			nodes.push(nextNodes[i].cloneNode(true));

		break;

	case '^': // CLIMB-UP

		nextNodes = emmet.getElement(emmetStr);

		nodes.climbup = nextNodes;

		break;

	case '*': // MULTIPLICATION

		var matchParam = /[0-9]+/.exec(emmetStr);

		if (!matchParam)
			break;

		var copyNodes = [];

		for (var i = 0; i < nodes.length; i++)
			copyNodes.push(nodes[i].cloneNode(true));

		for (var i = 0; i < parseInt(matchParam[0]) - 1; i++)
			for (var j = 0; j < copyNodes.length; j++)
				nodes.push(copyNodes[j].cloneNode(true));

		emmetStr = emmetStr.substring(matchParam.index);

		var matchParamEnd = /[^0-9]/.exec(emmetStr);

		if (!matchParamEnd)
			break;

		emmetStr = emmetStr.substring(matchParamEnd.index);

		emmet.getOperation(nodes, emmetStr);

		break;

	case '#': // ATTRIBUTE - ID

		emmetStr = emmetStr.substring(match.index + 1);

		var textMatch = /[a-zA-Z0-9_\-]+/.exec(emmetStr);

		emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length);

		if (!textMatch)
			break;

		for (var i = 0; i < nodes.length; i++)
			nodes[i].setAttribute('id', textMatch[0]);

		emmet.getOperation(nodes, emmetStr);

		break;

	case '.': // ATTRIBUTE - CLASS

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

	case '[': // ATTRIBUTE - CUSTOM

		emmetStr = emmetStr.substring(match.index + 1);

		var textMatch = /[^\]]+/.exec(emmetStr);

		emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length);

		if (!textMatch)
			break;

		var str = textMatch[0].trim().replace(/\s*=\s*/g, '=');

		var attrs = str.replace(/"([^"]+)"/g, function($0, $1) {
			return $1.replace(/\s/g, '_._');
		}).split(' ');

		for (var i = 0; i < nodes.length; i++)
			for (var j = 0; j < attrs.length; j++) {

				var attr = attrs[j]

				var attrParts = attr.split('=');
				var name = attrParts[0];
				var value = attrParts[1];

				if (value == undefined)
					value = '';

				value = value.replace(/_\._/g, ' ');

				nodes[i].setAttribute(name, value);
			}

		emmet.getOperation(nodes, emmetStr);

		break;

	case '{': // TEXT

		emmetStr = emmetStr.substring(match.index + 1);

		var textMatch = /[^\}]+/.exec(emmetStr);

		emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length);

		if (!textMatch)
			break;

		for (var i = 0; i < nodes.length; i++)
			nodes[i].appendChild(document.createTextNode(textMatch[0]));

		emmet.getOperation(nodes, emmetStr);

		break;
	}

	// FINSIH OFF CLIMB-UP

	if (!!nextNodes && !!nextNodes.climbup)
		for (var i = 0; i < nextNodes.climbup.length; i++)
			nodes.push(nextNodes.climbup[i].cloneNode(true));
};

// GET ELEMENT

emmet.getElement = function(emmetStr) {

	var nodes = [];

	if (!emmetStr)
		return nodes;

	var match = /[\(\{a-zA-Z]/.exec(emmetStr);

	if (!match)
		return nodes;

	switch (match[0]) {
	case '(':

		emmetStr = emmetStr.substring(match.index + 1);

		var counter = 1;
		var emmetStr2 = '';

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

			emmetStr2 += emmetStr.substring(0, matchBracket.index + 1);

			emmetStr = emmetStr.substring(matchBracket.index + 1);
		}

		emmetStr2 = emmetStr2.substring(0, emmetStr2.length - 1);

		nodes = emmet.getElement(emmetStr2);

		break;

	case '{':

		emmetStr = emmetStr.substring(match.index);

		emmetStr = emmetStr.substring(1);

		var textMatch = /[^\}]+/.exec(emmetStr);

		if (!textMatch) {

			emmetStr = '';

		} else {

			emmetStr = emmetStr.substring(textMatch.index + textMatch[0].length);
			nodes = [document.createTextNode(textMatch[0])];
		}

		break;

	default:

		emmetStr = emmetStr.substring(match.index);

		var matchBody = /[a-zA-Z0-9]+/.exec(emmetStr);

		if (!!matchBody) {

			emmetStr = emmetStr.substring(matchBody.index + matchBody[0].length);

			var elementName = matchBody[0];

			if (!!emmet.abbreviation[matchBody[0]] && emmet.abbreviation[matchBody[0]].element)
				elementName = emmet.abbreviation[matchBody[0]].element;

			nodes = [document.createElement(elementName)];

			if (!!emmet.abbreviation[matchBody[0]] && emmet.abbreviation[matchBody[0]].attributes) {
				var attributes = emmet.abbreviation[matchBody[0]].attributes;

				for (var i = 0; i < nodes.length; i++)
					for (var k in attributes)
						nodes[0].setAttribute(k, attributes[k]);
			}

		} else {

			emmetStr = '';
		}
	}

	emmet.getOperation(nodes, emmetStr);

	return nodes;
}

emmet.abbreviation = {
	"a": {
		"attributes": {
			"href":"#"
		}
	},
	"bq": {
		"element":"blockquote"
	}
};
