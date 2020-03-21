import { Point2D } from "../math";
import { IndexBuffer, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { ITextLayoutConfig } from "./SdfManager";
import { Typeface } from "./Typeface";

interface ICharacterLayout
{
	X: number;
	Y: number;
	Line: number;
	Verts: Array< number >;
}

export class Mesh
{
	private text: string = "";
	private readonly typeface: Typeface;
	private readonly indexBuffer: IndexBuffer;
	private readonly vertexBuffer: VertexBuffer;
	private readonly vbo: VertexBufferObject;

	private readonly alignment: Point2D;
	private readonly scale: number;
	private readonly lineSpacing: number;
	private readonly charSpacing: number;

	/** The number of triangles currently in the mesh */
	private triangleCount: number = 0;

	/**
	 * Creates an instance of Mesh.
	 */
	public constructor( renderer: WebGLRenderer, typeface: Typeface, layout: ITextLayoutConfig )
	{
		this.typeface = typeface;

		this.scale = layout.Scale;
		this.lineSpacing = layout.LineSpacing;
		this.charSpacing = layout.CharacterSpacing;
		this.alignment = Point2D.FromConfig( layout.Alignment );

		this.indexBuffer = new IndexBuffer( renderer, new Uint16Array( [] ) );
		this.vertexBuffer = new VertexBuffer( renderer, new Float32Array( [] ), [ 4 ] );
		this.vbo = new VertexBufferObject( this.indexBuffer, this.vertexBuffer );
	}

	/**
	 * Render the mesh with the currently set shader
	 */
	public Render( renderer: WebGLRenderer, attributeLocations: Array< number > ): void
	{
		this.vbo.Draw( renderer, attributeLocations, this.triangleCount * 3 );
	}

	/**
	 *
	 */
	public SetText( text: string ): void
	{
		if( text === this.text )
		{
			return;
		}

		if( text.length * 6 > this.indexBuffer.GetCount() ) // 6 indices per quad
		{
			this.indexBuffer.GenerateQuads( text.length + 8 - ( text.length % 4 ) );
		}

		const floatsPerVert = 4 * 4;
		const buffer = new Float32Array( text.length * floatsPerVert );
		const textLayout = this.GetTextLayout( text );
		textLayout.forEach( ( charLayout, index ) => this.CopyCharacterVertexData( charLayout, buffer, index * floatsPerVert, this.scale ) );
		this.vertexBuffer.SetData( buffer );
		this.triangleCount = textLayout.length * 2;
		this.text = text;
	}

	/**
	 * Copy character data into destination and apply the given layout and scale
	 */
	private CopyCharacterVertexData( layout: ICharacterLayout, destination: Float32Array, offset: number, scale: number )
	{
		destination.set( layout.Verts, offset );
		const x = layout.X * scale;
		const y = layout.Y * scale;
		for( let i = 0; i < 4; i++ )
		{
			const position = offset + i * 4;
			destination[ position ] = x + destination[ position ] * scale;
			destination[ position + 1 ] = y + destination[ position + 1 ] * scale;
		}
	}

	/**
	 * Layout each character in the text according to line breaks and alignments
	 */
	private GetTextLayout( text: string ): Array< ICharacterLayout >
	{
		const layout = new Array< ICharacterLayout >();
		const lineHeight = this.lineSpacing + this.typeface.Leading;
		const lineList = text.split( "\n" );
		const lineCount = lineList.length;
		const xAlignment = new Array< number >();
		lineList?.forEach( ( line, lineNumber ) =>
		{
			const yOffset = this.alignment.Y * ( 1.0 + ( lineCount - 1 ) * lineHeight ) - ( 1.0 + lineNumber * lineHeight );
			let previousCharacter = "";
			let xPosition = 0;
			for( const currentCharacter of line )
			{
				xPosition += this.typeface.GetAdvance( previousCharacter, currentCharacter, this.charSpacing );
				const verts = this.typeface.GetVerts( currentCharacter );
				if( verts.length > 0 )
				{
					layout.push( { X: xPosition, Y: yOffset, Line: lineNumber, Verts: verts } );
				}
				previousCharacter = currentCharacter;
			}
			xPosition += this.typeface.GetAdvance( previousCharacter, "", this.charSpacing );
			xAlignment.push( -xPosition * this.alignment.X );
		} );
		layout.forEach( ( charLayout ) => charLayout.X += xAlignment[ charLayout.Line ] );
		return layout;
	}
}
