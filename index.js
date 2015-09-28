var fs   = require('fs'),
	path = require('path');

var charming = function ( cfg ) {
	var chars = JSON.parse( fs.readFileSync( path.resolve( __dirname + '/chars.json' ), { encoding: 'utf16le' } ) );

	options = {
		ascii: true,
		html: true,
		raw: true,
		simple: false,
		unicode: true,
		dotnet: false,
		disableWarning: false
	};

	var clean = {
		ascii: [],
		html: [],
		raw: [],
		simple: [],
		unicode: [],
		dotnet: []
	};

	chars.forEach( function ( val, ix, arr ) {
		clean.ascii.push( String.fromCharCode( val.ascii ) );
		clean.html.push( '&' + val.html + ';' );
		clean.raw.push( val.raw );
		clean.simple.push( val.simple );
		clean.unicode.push( '\\u' + String( "0000" + val.unicode ).slice( -4 ) );
		clean.dotnet.push( '%u' + String( "0000" + val.unicode ).slice( -4 ) );
	} );

	if ( cfg ) {
		Object.keys( options ).forEach( function ( opt ) {
			if ( cfg.hasOwnProperty( opt ) ) {
				options[ opt ] = cfg[ opt ];
			}
		});
	}

	function convert ( input, source, target ) {
		if ( !input.split ) {
			return input;
		}
		output = input;
		if ( source == clean.html && target == clean.raw ) {
			output = output.replace( /&amp;([a-z0-9]+;)/ig, '&$1' );
		}
		source.forEach( function ( val, ix, arr ) {
			output = output.split( val ).join( target[ ix ] );
		} );
		if ( source == clean.raw && target == clean.html ) {
			output = output.replace( /&amp;([a-z0-9]+;)/ig, '&$1' );
		}
		return output;
	}

	function simpleWarning () {
		if ( options.disableWarning === false ) {
			console.log( 'Charmed warning: Conversion from simple is not recommended.' );
		}
	}

	/* ascii */
	this.asciiToHtml = function ( input ) {
		return convert( input, clean.ascii, clean.html );
	};

	this.asciiToRaw = function ( input ) {
		return convert( input, clean.ascii, clean.raw );
	};

	this.asciiToSimple = function ( input ) {
		return convert( input, clean.ascii, clean.simple );
	};

	this.asciiToUnicode = function ( input ) {
		return convert( input, clean.ascii, clean.unicode );
	};

	this.asciiToDotnet = function ( input ) {
		return convert( input, clean.ascii, clean.dotnet );
	};

	/* html */
	this.htmlToAscii = function ( input ) {
		return convert( input, clean.html, clean.ascii );
	};

	this.htmlToRaw = function ( input ) {
		return convert( input, clean.html, clean.raw );
	};

	this.htmlToSimple = function ( input ) {
		return convert( input, clean.html, clean.simple );
	};

	this.htmlToUnicode = function ( input ) {
		return convert( input, clean.html, clean.unicode );
	};

	this.htmlToDotnet = function ( input ) {
		return convert( input, clean.html, clean.dotnet );
	};

	/* raw */
	this.rawToAscii = function ( input ) {
		return convert( input, clean.raw, clean.ascii );
	};

	this.rawToHtml = function ( input ) {
		return convert( input, clean.raw, clean.html );
	};

	this.rawToSimple = function ( input ) {
		return convert( input, clean.raw, clean.simple );
	};

	this.rawToUnicode = function ( input ) {
		return convert( input, clean.raw, clean.unicode );
	};

	this.rawToDotnet = function ( input ) {
		return convert( input, clean.raw, clean.dotnet );
	};

	/* simple */
	this.simpleToAscii = function ( input ) {
		simpleWarning();
		return convert( input, clean.simple, clean.ascii );
	};

	this.simpleToRaw = function ( input ) {
		simpleWarning();
		return convert( input, clean.simple, clean.raw );
	};

	this.simpleToSimple = function ( input ) {
		simpleWarning();
		return convert( input, clean.simple, clean.simple );
	};

	this.simpleToUnicode = function ( input ) {
		simpleWarning();
		return convert( input, clean.simple, clean.unicode );
	};

	this.simpleToDotnet = function ( input ) {
		simpleWarning();
		return convert( input, clean.simple, clean.dotnet );
	};

	/* unicode */
	this.unicodeToAscii = function ( input ) {
		return convert( input, clean.unicode, clean.ascii );
	};

	this.unicodeToHtml = function ( input ) {
		return convert( input, clean.unicode, clean.html );
	};

	this.unicodeToRaw = function ( input ) {
		return convert( input, clean.unicode, clean.raw );
	};

	this.unicodeToSimple = function ( input ) {
		return convert( input, clean.unicode, clean.simple );
	};

	this.unicodeToDotnet = function ( input ) {
		return convert( input, clean.unicode, clean.dotnet );
	};

	/* dotnet */
	this.dotnetToAscii = function ( input ) {
		return convert( input, clean.dotnet, clean.ascii );
	};

	this.dotnetToHtml = function ( input ) {
		return convert( input, clean.dotnet, clean.html );
	};

	this.dotnetToRaw = function ( input ) {
		return convert( input, clean.dotnet, clean.raw );
	};

	this.dotnetToSimple = function ( input ) {
		return convert( input, clean.dotnet, clean.simple );
	};

	this.dotnetToUnicode = function ( input ) {
		return convert( input, clean.dotnet, clean.unicode );
	};

	/* convenience */
	this.toAscii = function ( input ) {
		var output = input;
		if ( options.html === true ) {
			output = this.htmlToAscii( output );
		}
		if ( options.raw === true ) {
			output = this.rawToAscii( output );
		}
		if ( options.simple === true ) {
			output = this.simpleToAscii( output );
		}
		if ( options.unicode === true ) {
			output = this.unicodeToAscii( output );
		}
		if ( options.dotnet === true ) {
			output = this.dotnetToAscii( output );
		}
		return output;
	};

	this.toHtml = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = this.asciiToHtml( output );
		}
		if ( options.raw === true ) {
			output = this.rawToHtml( output );
		}
		if ( options.simple === true ) {
			output = this.simpleToHtml( output );
		}
		if ( options.unicode === true ) {
			output = this.unicodeToHtml( output );
		}
		if ( options.dotnet === true ) {
			output = this.dotnetToHtml( output );
		}
		/* special case: double-escaped ampersand cleanup */
		output.replace( /&amp;([a-z0-9]+;)/ig, '&$1', 'ig' );
		return output;
	};

	this.toRaw = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = this.asciiToRaw( output );
		}
		if ( options.html === true ) {
			output = this.htmlToRaw( output );
		}
		if ( options.simple === true ) {
			output = this.simpleToRaw( output );
		}
		if ( options.unicode === true ) {
			output = this.unicodeToRaw( output );
		}
		if ( options.dotnet === true ) {
			output = this.dotnetToRaw( output );
		}
		return output;
	};

	this.toSimple = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = this.asciiToSimple( output );
		}
		if ( options.html === true ) {
			output = this.htmlToSimple( output );
		}
		if ( options.raw === true ) {
			output = this.rawToSimple( output );
		}
		if ( options.unicode === true ) {
			output = this.unicodeToSimple( output );
		}
		if ( options.dotnet === true ) {
			output = this.dotnetToSimple( output );
		}
		return output;
	};

	this.toUnicode = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = this.asciiToUnicode( output );
		}
		if ( options.html === true ) {
			output = this.htmlToUnicode( output );
		}
		if ( options.raw === true ) {
			output = this.rawToUnicode( output );
		}
		if ( options.simple === true ) {
			output = this.simpleToUnicode( output );
		}
		if ( options.dotnet === true ) {
			output = this.dotnetToUnicode( output );
		}
		return output;
	};

	this.toDotnet = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = this.asciiToDotnet( output );
		}
		if ( options.html === true ) {
			output = this.htmlToDotnet( output );
		}
		if ( options.raw === true ) {
			output = this.rawToDotnet( output );
		}
		if ( options.simple === true ) {
			output = this.simpleToDotnet( output );
		}
		if ( options.dotnet === true ) {
			output = this.dotnetToDotnet( output );
		}
		return output;
	};

	return this;
};

module.exports = charming;
