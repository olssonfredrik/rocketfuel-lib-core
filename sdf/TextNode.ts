import { Camera, Engine } from "../engine";
import { Transform } from "../math";
import { DebugNode, LeafNode } from "../nodes";
import { WebGLRenderer } from "../render";
import { ITextItem } from "../text";
import { IJSONObject, JSONUtil } from "../util";
import { Font } from "./Font";
import { Mesh } from "./Mesh";

export class TextNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): TextNode
	{
		const nodeConfig = JSONUtil.AsType< ITextNodeConfig >( config );
		const font = engine.SdfManager.GetFont( nodeConfig.Font );
		const node = new TextNode( nodeConfig.Name, engine.Renderer, font, engine.TextManager.Get( nodeConfig.Text ) );
		return node;
	}

	public debug: DebugNode | undefined;
	private mesh: Mesh;
	private font: Font;
	private text: ITextItem;

	/**
	 * Creates an instance of TextNode.
	 */
	public constructor( name: string, renderer: WebGLRenderer, font: Font, text: ITextItem )
	{
		super( name );

		this.font = font;
		this.mesh = new Mesh( renderer, font.Typeface, font.Layout );
		this.text = text;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		super.Update( deltaTime, transform, color );

		this.mesh.SetText( this.text.GetText() );
		this.debug?.Update( 0, this.transform, this.color );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		this.font.RenderPasses.forEach( ( pass ) =>
		{
			pass.SetActive( renderer, camera, this.transform, this.color, this.font.Texture );
			const attributeLocations = pass.GetAttributeLocations( [ "aVertexPosition" ] );
			this.mesh.Render( renderer, attributeLocations );
		} );
		this.debug?.Render( renderer, camera );
	}

	/**
	 *
	 */
	public SetText( text: ITextItem )
	{
		this.text = text;
	}
}

interface ITextNodeConfig
{
	Name: string;
	Font: string;
	Text: string;
}
