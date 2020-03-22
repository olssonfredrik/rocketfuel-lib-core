import { DownloadManager } from "../download";
import { IPoint2DConfig, Point2D } from "../math";
import { ShaderManager, TextureManager } from "../render";
import { IJSONObject, JSONUtil, MapUtil } from "../util";
import { Font } from "./Font";
import { IFntData } from "./IFntData";
import { RenderPass } from "./RenderPass";
import { Typeface } from "./Typeface";

export class SdfManager
{
	private readonly textureManager: TextureManager;
	private readonly shaderManager: ShaderManager;
	private readonly faces = new Map< string, Typeface >();
	private readonly styles = new Map< string, Array< RenderPass > >();
	private readonly configs = new Map< string, IFontConfig >();

	/**
	 * Creates an instance of SdfManager.
	 */
	public constructor( textureManager: TextureManager, shaderManager: ShaderManager )
	{
		this.textureManager = textureManager;
		this.shaderManager = shaderManager;
	}

	/**
	 *
	 */
	public Init( data: IJSONObject, downloadManager: DownloadManager )
	{
		const fontData = JSONUtil.AsType< IFontManagerConfig >( data );

		Object.keys( fontData.Typefaces ).forEach( ( key ) =>
		{
			const typeface = JSONUtil.GetAssertedAsType< ITypeface >( fontData.Typefaces, key );
			const fntData = JSONUtil.AsType< IFntData >( downloadManager.GetJson( typeface.Path ) );
			this.faces.set( key, new Typeface( fntData ) );
		} );

		Object.keys( fontData.Styles ).forEach( ( key ) =>
		{
			const style = JSONUtil.GetAssertedAsType< IFontStyle >( fontData.Styles, key );

			const passes = new Array< RenderPass >();
			style.Passes.forEach( ( pass ) =>
			{
				const shader = this.shaderManager.Get( pass.Shader ?? "RFLib/Sdf" );
				const offset = ( !!pass.Offset ? Point2D.FromConfig( pass.Offset ) : new Point2D() );
				const uniforms: Map< string, ( number | Array< number > )> = new Map< string, ( number | Array< number > ) >();
				pass.Uniforms?.forEach( ( uniform ) =>
				{
					uniforms.set( uniform.Name, uniform.Value );
				} );
				passes.push( new RenderPass( shader, this.textureManager, pass.Textures ?? [], uniforms, offset ) );
			} );
			this.styles.set( key, passes );
		} );

		Object.keys( fontData.Configs ).forEach( ( key ) =>
		{
			const value = JSONUtil.GetAssertedAsType< IFontConfig >( fontData.Configs, key );
			this.configs.set( key, value );
		} );
	}

	/**
	 *
	 */
	public GetFont( id: string ): Font
	{
		const config = this.GetConfig( id );
		const type = this.GetTypeface( config.Typeface );
		const style = this.GetStyle( config.Style );
		return new Font( type, style, config.Layout );
	}

	/**
	 *
	 */
	private GetConfig( id: string ): IFontConfig
	{
		return MapUtil.AssertedGet( this.configs, id, "Unable to find font config for id [" + id + "]." );
	}

	/**
	 *
	 */
	private GetStyle( id: string ): Array< RenderPass >
	{
		return MapUtil.AssertedGet( this.styles, id , "Unable to find render passes for style id [" + id + "]." );
	}

	/**
	 *
	 */
	private GetTypeface( id: string ): Typeface
	{
		return MapUtil.AssertedGet( this.faces, id, "Unable to find typeface for id [" + id + "]." );
	}
}

interface IFontManagerConfig
{
	Typefaces: IJSONObject;
	Styles: IJSONObject;
	Configs: IJSONObject;
}

interface ITypeface
{
	Path: string;
}

interface IFontStyle
{
	Passes: Array< IRenderPassConfig >;
}

interface IRenderPassConfig
{
	Uniforms?: Array< IUniformConfig >;
	Offset?: IPoint2DConfig;
	Shader?: string;
	Textures?: Array< string >;
}

interface IUniformConfig
{
	Name: string;
	Value: ( number | Array< number > );
}

interface IFontConfig
{
	Typeface: string;
	Style: string;
	Layout: ITextLayoutConfig;
}

export interface ITextLayoutConfig
{
	Scale: number;
	Alignment: IPoint2DConfig;
	CharacterSpacing: number;
	LineSpacing: number;
}
