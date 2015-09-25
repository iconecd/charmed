var fs = require('fs');
var path = require('path');

var chars = JSON.parse( fs.readFileSync( path.resolve( __dirname + '/chars.json' ), { encoding: 'utf16le' } ) );

var options = {
	ascii: true,
	html: true,
	raw: true,
	simple: false,
	unicode: true,
	disableWarning: false
};

var clean = {
	ascii: [],
	html: [],
	raw: [],
	simple: [],
	unicode: []
};

chars.forEach( function ( val, ix, arr ) {
	clean.ascii.push( String.fromCharCode( val.ascii ) );
	clean.html.push( '&' + val.html + ';' );
	clean.raw.push( val.raw );
	clean.simple.push( val.simple );
	clean.unicode.push( '\\u' + String( "0000" + val.unicode ).slice( -4 ) );
} );

var charming = function () {
	var self = this;

	function convert ( input, source, target ) {
		output = input;
		source.forEach( function ( val, ix, arr ) {
			output = output.split( val ).join( target[ ix ] );
		} );
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

	/* convenience */
	this.toAscii = function ( input ) {
		var output = input;
		if ( options.html === true ) {
			output = self.htmlToAscii( output );
		}
		if ( options.raw === true ) {
			output = self.rawToAscii( output );
		}
		if ( options.simple === true ) {
			output = self.simpleToAscii( output );
		}
		if ( options.unicode === true ) {
			output = self.unicodeToAscii( output );
		}
		return output;
	};

	this.toHtml = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = self.asciiToHtml( output );
		}
		if ( options.raw === true ) {
			output = self.rawToHtml( output );
		}
		if ( options.simple === true ) {
			output = self.simpleToHtml( output );
		}
		if ( options.unicode === true ) {
			output = self.unicodeToHtml( output );
		}
		return output;
	};

	this.toRaw = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = self.asciiToRaw( output );
		}
		if ( options.html === true ) {
			output = self.htmlToRaw( output );
		}
		if ( options.simple === true ) {
			output = self.simpleToRaw( output );
		}
		if ( options.unicode === true ) {
			output = self.unicodeToRaw( output );
		}
		return output;
	};

	this.toSimple = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = self.asciiToSimple( output );
		}
		if ( options.html === true ) {
			output = self.htmlToSimple( output );
		}
		if ( options.raw === true ) {
			output = self.rawToSimple( output );
		}
		if ( options.unicode === true ) {
			output = self.unicodeToSimple( output );
		}
		return output;
	};

	this.toUnicode = function ( input ) {
		var output = input;
		if ( options.ascii === true ) {
			output = self.asciiToUnicode( output );
		}
		if ( options.html === true ) {
			output = self.htmlToUnicode( output );
		}
		if ( options.raw === true ) {
			output = self.rawToUnicode( output );
		}
		if ( options.simple === true ) {
			output = self.simpleToUnicode( output );
		}
		return output;
	};

	this.config = function ( configOpts ) {
		var opts = Object.keys( options );
		for ( var opt in opts ) {
			if ( configOpts.hasOwnProperty( opt ) ) {
				options[ opt ] = configOpts[ opt ];
			}
		}
	};
};

module.exports = new charming();
