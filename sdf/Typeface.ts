import { MapUtil } from "../util";
import { ICharacter, ICommonData, IFntData } from "./IFntData";

export class Typeface
{

	/**
	 *
	 */
	private static GetCapHeight( fntData: IFntData ): number
	{
		// Character Lookup
		const characters: Map< string, ICharacter > = new Map< string, ICharacter >();
		fntData.chars.forEach( ( char ) =>
		{
			characters.set( String.fromCodePoint( char.id ), char );
		} );

		const capCharacters = "EBDIHN14";
		const padding = fntData.info.padding[ 0 ] + fntData.info.padding[ 2 ];

		for( let i = 0; i < capCharacters.length; i++ )
		{
			const char = characters.get( capCharacters.charAt( i ) );
			if( !!char )
			{
				return char.height - padding;
			}
		}
		return fntData.common.base - padding;
	}

	/**
	 *
	 */
	private static GetLeading( fntData: IFntData ): number
	{
		return fntData.common.lineHeight - fntData.info.padding[ 0 ] - fntData.info.padding[ 2 ] + fntData.info.spacing[ 1 ];
	}

	/**
	 *
	 */
	private static CreateVerts( char: ICharacter, common: ICommonData, scale: number ): Array< number >
	{
		// normalize UVs
		const u0 = char.x / common.scaleW;
		const v0 = char.y / common.scaleH;
		const u1 = ( char.x + char.width ) / common.scaleW;
		const v1 = ( char.y + char.height ) / common.scaleH;

		const x0 = char.xoffset * scale;
		const y0 = ( common.base - char.yoffset ) * scale;
		const x1 = x0 + char.width * scale;
		const y1 = y0 - char.height * scale;

		return new Array< number >( x0, y0, u0, v0, x1, y0, u1, v0, x1, y1, u1, v1, x0, y1, u0, v1 );
	}

	public readonly Name: string;
	public readonly Texture: string;
	public readonly Leading: number;

	private spacingMinusPad: number;
	private kerningPairs: Map< string, number >;
	private advance: Map< string, number >;
	private verts: Map< string, Array< number > >;

	/**
	 * Creates an instance of a Typeface.
	 */
	public constructor( fntData: IFntData )
	{
		this.Name = fntData.info.face;

		// Leading
		const scale = 1.0 / Typeface.GetCapHeight( fntData );
		this.Leading = Typeface.GetLeading( fntData ) * scale;

		// Kerning Pairs
		this.kerningPairs = new Map< string, number >();
		fntData.kernings.forEach( ( pair ) =>
		{
			this.kerningPairs.set( String.fromCodePoint( pair.first ) + String.fromCodePoint( pair.second ), pair.amount * scale );
		} );

		// Character Data
		this.advance = new Map< string, number >();
		this.advance.set( "", 0 );
		fntData.chars.forEach( ( char ) =>
		{
			this.advance.set( String.fromCodePoint( char.id ), char.xadvance * scale );
		} );

		// Texture
		this.Texture = "Fonts/" + fntData.pages[ 0 ];

		this.spacingMinusPad = scale * ( fntData.info.spacing[ 0 ] - fntData.info.padding[ 3 ] );

		// Verts
		this.verts = new Map< string, Array< number > >();
		fntData.chars.forEach( ( char ) =>
		{
			this.verts.set( String.fromCodePoint( char.id ), Typeface.CreateVerts( char, fntData.common, scale ) );
		} );

		const dummySpaces = [ 160 ];
		dummySpaces.forEach( ( space ) =>
		{
			this.advance.set( String.fromCodePoint( space ), this.advance.get( " " ) ?? 0 );
			this.verts.set( String.fromCodePoint( space ), this.verts.get( " " ) ?? [] );
		} );
		this.verts.set( "\n", [] );
	}

	/**
	 *
	 */
	public GetVerts( character: string ): Array< number >
	{
		return MapUtil.AssertedGet( this.verts, character, "Could not find character '" + character + "' in Typeface " + this.Name + "." );
	}

	/**
	 * Get the advance, in screen space, going from one character to the next.
	 */
	public GetAdvance( from: string, to: string, characterSpacing: number ): number
	{
		const kerning = this.kerningPairs.get( from + to ) ?? 0;
		const xAdvance = MapUtil.AssertedGet( this.advance, from, "Could not find character '" + from + "' in Typeface " + this.Name + "." );
		if( xAdvance === 0 )
		{
			return 0;
		}
		return characterSpacing + ( xAdvance + kerning + this.spacingMinusPad );
	}

}
